//import { sampleFunction } from '@src/sampleFunction';
//import { TextExtractor } from '@src/contentScript';
import { filterPage, setupObserver } from '@src/content';
import { facebookConfigs, twitterConfigs, youtubeConfigs } from '@extension/storage';
import { initModel } from '@extension/shared';

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

const youtubeListener = async (settings: any, currentHost: string, currentPath: string) => {
  let temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['youtube'],
  };
  const exemptPages = settings['youtube'][youtubeConfigs.others.exempt] || [];
  if (!exemptPages.includes(currentPath)) {
    if (currentPath != lastPath && currentHost == lastHost) {
      window.location.reload();
    }
    lastPath = currentPath;
    lastHost = currentHost;
    filterPage(youtubeConfigs, temp);
    setupObserver(youtubeConfigs, temp);
  }
};

// handles URL changes and applies settings
const handleURLChange = () => {
  const currentURL = new URL(window.location.href);
  const currentHost = window.location.hostname;
  const currentPath = currentURL.pathname + currentURL.search;

  chrome.storage.sync.get(null, settings => {
    console.log(settings);
    //if power is on we run
    if (settings['powerState']) {
      // Hide or manage elements based on settings and URL
      if (currentHost.includes('facebook.com') && settings['extension']['facebook-toggle']) {
        facebookListener(settings, currentHost, currentPath);
      } else if (currentHost.includes('x.com') && settings['extension']['twitter-toggle']) {
        const temp = {
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
        youtubeListener(settings, currentHost, currentPath);
      }
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
