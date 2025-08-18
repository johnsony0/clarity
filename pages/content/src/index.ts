//import { sampleFunction } from '@src/sampleFunction';
//import { TextExtractor } from '@src/contentScript';
import { filterPage, setupObserver } from '@src/content';
import { facebookConfigs, twitterConfigs, youtubeConfigs } from '@extension/storage';
import { initModel, waitForElm } from '@extension/shared';

console.log('content script loaded');

let lastURL = '';
let lastPath = '';
let lastHost = '';

const facebookListener = async (settings: any, currentHost: string, currentPath: string) => {
  let temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['facebook'],
  };
  console.log(temp);
  const exemptPages = settings['facebook'][facebookConfigs.others.exempt] || [];
  if (!exemptPages.includes(currentPath)) {
    if (currentPath != lastPath && currentHost == lastHost) {
      window.location.reload();
    }
    lastPath = currentPath;
    lastHost = currentHost;
    filterPage(facebookConfigs, temp);
    setupObserver(facebookConfigs, temp);
  }
};

const youtubeListener = async (settings: any, currentPath: string) => {
  let targetSelector = { selector: '', type: '', parents: 0 };
  console.log(currentPath);
  if (currentPath === '/') {
    targetSelector = { selector: '[name="www-main-desktop-watch-page-skeleton"]', type: 'attribute', parents: 0 };
    console.log('Home page detected');
  } else if (currentPath.startsWith('/watch')) {
    targetSelector = {
      selector:
        '[style="--ytd-masthead-height: 56px; --ytd-masthead-height-absolute: 56px; --ytd-network-status-banner-display: unset;"]',
      type: 'attribute',
      parents: 0,
    };
    console.log('Video detected');
  } else if (currentPath.startsWith('/@')) {
    targetSelector = { selector: '[id="page-header-banner"]', type: 'attribute', parents: 0 };
    console.log('User profile detected');
  } else {
    targetSelector = { selector: 'contents', type: 'id', parents: 0 };
    console.log('General page or sub-page detected');
  }
  waitForElm(document, targetSelector).then(() => {
    let temp = {
      ...settings['extension'],
      ...settings['quick-settings'],
      ...settings['toggleStates'],
      ...settings['youtube'],
    };
    const exemptPages = settings['youtube'][youtubeConfigs.others.exempt] || [];
    if (!exemptPages.includes(currentPath)) {
      filterPage(youtubeConfigs, temp);
      setupObserver(youtubeConfigs, temp);
    }
  });
};

// handles URL changes and applies settings
const handleURLChange = () => {
  const currentURL = new URL(window.location.href);
  const currentHost = window.location.hostname;
  const currentPath = currentURL.pathname + currentURL.search;

  chrome.storage.sync.get(null, settings => {
    let temp = {};
    temp = { ...temp, ...settings['extension'] };
    temp = { ...temp, ...settings['quick-settings'] };
    temp = { ...temp, ...settings['toggleStates'] };

    // Hide or manage elements based on settings and URL
    if (currentHost.includes('facebook.com') && settings['extension']['facebook-toggle']) {
      facebookListener(settings, currentHost, currentPath);
    } else if (currentHost.includes('x.com') && settings['extension']['twitter-toggle']) {
      temp = {
        ...settings['extension'],
        ...settings['quick-settings'],
        ...settings['toggleStates'],
        ...settings['twitter'],
      };
      console.log('Observing Twitter posts...', temp);
      const exemptPages = settings['twitter'][twitterConfigs.others.exempt] || [];
      if (!exemptPages.includes(currentPath)) {
        filterPage(twitterConfigs, temp);
        setupObserver(twitterConfigs, temp);
      }
    } else if (currentHost.includes('youtube.com') && settings['extension']['youtube-toggle']) {
      youtubeListener(settings, currentPath);
    }
  });
};

// Initialize the observer and handle URL changes
const observe = () => {
  lastURL = window.location.href;
  lastPath = window.location.pathname;

  const observer = new MutationObserver(() => {
    const currentURL = window.location.href;
    if (currentURL !== lastURL) {
      lastURL = currentURL;
      handleURLChange();
    }
  });
  observer.observe(document, { childList: true, subtree: true, attributes: true });

  //model only runs on facebook or x/twitter
  if (window.location.hostname.includes('x.com') || window.location.hostname.includes('facebook.com')) {
    initModel();
  }

  handleURLChange();
};

observe();
