//import { sampleFunction } from '@src/sampleFunction';
//import { TextExtractor } from '@src/contentScript';
import { filterPage, processPost } from '@src/content';
import { facebookConfigs, twitterConfigs, youtubeConfigs } from '@extension/storage';
import { initModel, findElement, waitForElm } from '@extension/shared';
import type { PlatformConfig, Settings } from '@extension/shared';

console.log('content script loaded');

let lastURL = '';
let currentMainObserver: MutationObserver | null = null;
let currentMainContainer: Element | null = null;
let currentSiteContainer: Element | null = null;

export const setupObserver = (platformConfig: PlatformConfig, settings: Settings) => {
  //disconnect previous observer if it exists
  if (currentMainObserver) {
    currentMainObserver.disconnect();
    console.log('Disconnected previous main observer.');
  }
  waitForElm(document, platformConfig.mainContainer).then(mainContainer => {
    if (!mainContainer) {
      console.warn('Main container not found for this platform.');
      return;
    }
    // Process initial posts after mainContainer is found
    platformConfig.postContainer.forEach(containerSelector => {
      const initialPosts = mainContainer.querySelectorAll(containerSelector.selector);
      initialPosts.forEach(postContainer => processPost(platformConfig, settings, postContainer as HTMLElement));
    });
    // Observe for new posts
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof Element) {
            platformConfig.postContainer.forEach(containerSelector => {
              const postContainer = findElement(node, containerSelector);
              if (postContainer && !postContainer.dataset.processed) {
                postContainer.dataset.processed = 'true';
                console.log(postContainer);
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

const setupFBObserver = async (platformConfig: PlatformConfig, settings: Settings) => {
  if (currentMainObserver) {
    currentMainObserver.disconnect();
    console.log('Disconnected previous main observer.');
  }

  const waitForNewContainer = async (
    currentContainer: Element | null,
    selectorAttribute: string,
  ): Promise<Element | null> => {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      const containers = document.querySelectorAll(selectorAttribute);
      console.log(`Found ${containers.length} potential containers.`, containers);
      let newContainer: Element | null = null;
      console.log('Current container:', currentContainer);
      for (const container of Array.from(containers)) {
        if (container !== currentContainer) {
          newContainer = container;
          break;
        }
      }
      if (newContainer) {
        console.log('New container found and assigned.', newContainer);
        return newContainer;
      }
      console.log('No new container found, retrying...');
      await new Promise(res => setTimeout(res, 1000));
      attempts++;
    }
    console.warn('Max attempts reached, new main container not found, returning default.');
    return currentContainer;
  };

  const newSiteContainer = await waitForNewContainer(currentSiteContainer, platformConfig.siteContainer.selector);
  if (!newSiteContainer) {
    console.warn('Site container not found, aborting observer setup.');
    return;
  }
  currentSiteContainer = newSiteContainer;

  waitForNewContainer(currentMainContainer, platformConfig.mainContainer.selector).then(mainContainer => {
    if (!mainContainer) {
      console.warn('Main container not found or did not change for this platform.');
      return;
    }
    currentMainContainer = mainContainer;
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
              if (postContainer) {
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
    await setupFBObserver(facebookConfigs, temp);
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
    await new Promise(res => setTimeout(res, 1500));
    setupObserver(youtubeConfigs, temp);
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
