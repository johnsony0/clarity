//import { sampleFunction } from '@src/sampleFunction';
//import { TextExtractor } from '@src/contentScript';
import { filterPage, setupObserver } from '@src/content';
import { facebookConfigs, twitterConfigs, youtubeConfigs } from '@extension/storage';
import { initModel, waitForElm } from '@extension/shared';

console.log('content script loaded');

let lastURL = '';

const facebookListener = async (settings: any, currentPath: string) => {
  let targetSelector = { selector: '', type: '', parents: 0 };
  console.log(currentPath);
  if (currentPath === '/') {
    targetSelector = { selector: '[aria-label="Create a post"]', type: 'attribute', parents: 0 };
    console.log('Home page detected');
  } else if (currentPath.startsWith('/groups/')) {
    targetSelector = { selector: '[aria-label="Invite"]', type: 'attribute', parents: 0 };
    console.log('Group page detected');
  } else if (currentPath.match(/^\/[a-zA-Z0-9.]+$/)) {
    targetSelector = { selector: '[role="tablist"]', type: 'attribute', parents: 0 };
    console.log('User profile detected');
  } else {
    targetSelector = { selector: '[role="main"]', type: 'attribute', parents: 0 };
    console.log('General page or sub-page detected');
  }
  console.log('Target selector:', targetSelector);
  // Wrap the waitForElm call in a new Promise to handle URL confirmation
  await new Promise<void>(resolve => {
    const observer = new MutationObserver(() => {
      const elm = document.querySelector(targetSelector.selector);
      const isCorrectUrl = window.location.pathname === currentPath;

      // Check if both the element and the correct URL are present
      if (elm && isCorrectUrl) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
  console.log('resolved promise');
  // This code only runs after the promise resolves (i.e., element and URL are correct)
  let temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['facebook'],
  };
  const exemptPages = settings['facebook'][facebookConfigs.others.exempt] || [];
  if (!exemptPages.includes(currentPath)) {
    filterPage(facebookConfigs, temp);
    setupObserver(facebookConfigs, temp);
  }
};

// handles URL changes and applies settings
const handleURLChange = () => {
  const currentHost = window.location.hostname;
  const currentPath = window.location.pathname;
  chrome.storage.sync.get(null, settings => {
    let temp = {};
    temp = { ...temp, ...settings['extension'] };
    temp = { ...temp, ...settings['quick-settings'] };
    temp = { ...temp, ...settings['toggleStates'] };

    // Hide or manage elements based on settings and URL
    if (currentHost.includes('facebook.com') && settings['extension']['facebook-toggle']) {
      temp = { ...temp, ...settings['facebook'] };
      console.log('Observing Facebook posts...', temp);
      facebookListener(settings, currentPath);
    } else if (currentHost.includes('x.com') && settings['extension']['twitter-toggle']) {
      temp = { ...temp, ...settings['twitter'] };
      console.log('Observing Twitter posts...', temp);
      const exemptPages = settings['twitter'][twitterConfigs.others.exempt] || [];
      if (!exemptPages.includes(currentPath)) {
        filterPage(twitterConfigs, temp);
        setupObserver(twitterConfigs, temp);
      }
    } else if (currentHost.includes('youtube.com') && settings['extension']['youtube-toggle']) {
      temp = { ...temp, ...settings['youtube'] };
      console.log('Observing Youtube videos...', temp);
      const exemptPages = settings['youtube'][youtubeConfigs.others.exempt] || [];
      if (!exemptPages.includes(currentPath)) {
        filterPage(youtubeConfigs, temp);
        setupObserver(youtubeConfigs, temp);
      }
    } else {
      console.log('This script does not apply to this site.');
    }
  });
};

// Initialize the observer and handle URL changes
const observe = () => {
  lastURL = window.location.href;

  const observer = new MutationObserver(() => {
    const currentURL = window.location.href;
    if (currentURL !== lastURL) {
      console.log(`[MutationObserver] URL changed from ${lastURL} to ${currentURL}`);
      lastURL = currentURL;
      //refresh for facebook to facebook, youtube to youtube, and so on. Bandaid solution for single page applications interfering with reloading of filters.
      //window.location.reload();
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
