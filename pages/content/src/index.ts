//import { sampleFunction } from '@src/sampleFunction';
//import { TextExtractor } from '@src/contentScript';
import { filterPage, processPost } from '@src/content';
import { facebookConfigs, twitterConfigs, youtubeConfigs } from '@extension/storage';
import { initModel, findElement, waitForElm } from '@extension/shared';
import type { PlatformConfig, Settings } from '@extension/shared';

console.log('content script loaded');

let lastURL = '';
let lastPath = '';
let lastHost = '';
let currentMainObserver: MutationObserver | null = null;
let currentContainer: Element | null = null;

const setupObserver = async (platformConfig: PlatformConfig, settings: Settings) => {
  if (currentMainObserver) {
    currentMainObserver.disconnect();
    console.log('Disconnected previous main observer.');
  }
  const waitForNewMainContainer = async (): Promise<Element | null> => {
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
      const mainContainers = document.querySelectorAll(platformConfig.siteContainer.selector);
      console.log(`Found ${mainContainers.length} potential main containers.`);
      let newContainer: Element | null = null;
      for (const container of Array.from(mainContainers)) {
        if (container !== currentContainer) {
          newContainer = container;
          break;
        }
      }
      if (newContainer) {
        currentContainer = newContainer;
        console.log('New main container found and assigned.');
        return newContainer;
      }
      await new Promise(res => setTimeout(res, 1000));
      attempts++;
    }
    console.warn('Max attempts reached, new main container not found.');
    return null;
  };

  waitForNewMainContainer().then(mainContainer => {
    if (!mainContainer) {
      console.warn('Main container not found or did not change for this platform.');
      return;
    }
    platformConfig.postContainer.forEach(containerSelector => {
      const initialPosts = mainContainer.querySelectorAll(containerSelector.selector);
      initialPosts.forEach(postContainer => processPost(platformConfig, settings, postContainer as HTMLElement));
    });
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof Element) {
            platformConfig.postContainer.forEach(containerSelector => {
              const postContainer = findElement(node, containerSelector);
              if (postContainer && !postContainer.dataset.processed) {
                postContainer.dataset.processed = 'true';
                processPost(platformConfig, settings, postContainer);
              }
            });
          }
        });
      });
    });
    observer.observe(mainContainer, { childList: true, subtree: true });
    currentMainObserver = observer;
  });
};

const facebookListener = async (settings: any, currentHost: string, currentPath: string) => {
  let temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['facebook'],
  };
  const exemptPages = settings['facebook'][facebookConfigs.others.exempt] || [];
  if (!exemptPages.includes(currentPath)) {
    await setupObserver(facebookConfigs, temp);
    await new Promise(res => setTimeout(res, 200));
    filterPage(facebookConfigs, temp);
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
    await setupObserver(youtubeConfigs, temp);
    await new Promise(res => setTimeout(res, 200));
    filterPage(youtubeConfigs, temp);
  }
};

// handles URL changes and applies settings
const handleURLChange = () => {
  const currentURL = new URL(window.location.href);
  const currentHost = window.location.hostname;
  const currentPath = currentURL.pathname + currentURL.search;

  chrome.storage.sync.get(null, settings => {
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
