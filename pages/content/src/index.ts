//import { sampleFunction } from '@src/sampleFunction';
//import { TextExtractor } from '@src/contentScript';
import { filterPage, processPost } from '@src/content';
import { facebookConfigs, twitterConfigs, youtubeConfigs, twitchConfigs } from '@extension/storage';
import { initModel, findElement, waitForElm } from '@extension/shared';
import type { PlatformConfig, Settings } from '@extension/shared';

console.log('content script loaded');

let lastURL = '';
let currentMainObserver: MutationObserver | null = null;
let currentMainContainer: Element | null = null;
let currentSiteContainer: Element | null = null;

export const setupObserver = (platformConfig: PlatformConfig, settings: Settings) => {
  //works regularly with twitter for now
  //disconnect previous observer if it exists
  if (currentMainObserver) {
    currentMainObserver.disconnect();
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
  //for some odd reason FB loads in the primary main container second so we need to wait for it
  if (currentMainObserver) {
    currentMainObserver.disconnect();
  }

  const waitForNewContainer = async (
    currentContainer: Element | null,
    selectorAttribute: string,
  ): Promise<Element | null> => {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      const containers = document.querySelectorAll(selectorAttribute);
      let newContainer: Element | null = null;
      for (const container of Array.from(containers)) {
        if (container !== currentContainer) {
          newContainer = container;
          break;
        }
      }
      if (newContainer) {
        return newContainer;
      }
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

  waitForNewContainer(currentMainContainer, platformConfig.mainContainer.selector).then(async mainContainer => {
    //wait a bit for posts to load in after the maincontainer
    await new Promise(res => setTimeout(res, 500));
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
  //[class="x193iq5w xvue9z xq1tmr x1ceravr"]
  //[class="x1hc1fzr x1unhpq9 x6o7n8i"]
  //[class="class="x1xzczws"]
  //style="display: none;"
  let temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['facebook'],
  };
  const exemptPages = settings['facebook'][facebookConfigs.others.exempt] || [];
  if (!exemptPages.includes(currentPath)) {
    await setupFBObserver(facebookConfigs, temp);
    await new Promise(res => setTimeout(res, 500));
    filterPage(facebookConfigs, temp);
  }
};

export const setupYTObserver = (platformConfig: PlatformConfig, settings: Settings) => {
  //YT observer will run on every main container
  //disconnect previous observer if it exists
  if (currentMainObserver) {
    currentMainObserver.disconnect();
    console.log('Disconnected previous main observer.');
  }
  document.querySelectorAll('[id="contents"]').forEach(mainContainer => {
    // Process initial posts after mainContainer is found
    console.log(mainContainer);
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

const youtubeListener = async (settings: any, currentHost: string, currentPath: string) => {
  let temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['youtube'],
  };
  const exemptPages = settings['youtube'][youtubeConfigs.others.exempt] || [];

  if (!exemptPages.includes(currentPath)) {
    setTimeout(() => {
      setupYTObserver(youtubeConfigs, temp);
    }, 1500);

    let iterations = 0;
    const maxIterations = 15;
    const filterInterval = setInterval(() => {
      filterPage(youtubeConfigs, temp);
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(filterInterval);
      }
    }, 100);
  }
};

const twitchListener = async (settings: any, currentHost: string, currentPath: string) => {
  const temp = {
    ...settings['extension'],
    ...settings['quick-settings'],
    ...settings['toggleStates'],
    ...settings['twitch'],
  };
  const exemptPages = settings['twitch'][twitchConfigs.others.exempt] || [];
  if (!exemptPages.includes(currentPath)) {
    setTimeout(() => {
      setupObserver(twitchConfigs, temp);
    }, 1000);

    let iterations = 0;
    const maxIterations = 15;
    const filterInterval = setInterval(() => {
      filterPage(twitchConfigs, temp);
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(filterInterval);
      }
    }, 100);
  }
};

// handles URL changes and applies settings
const handleURLChange = () => {
  const currentURL = new URL(window.location.href);
  const currentHost = window.location.hostname;
  const currentPath = currentURL.pathname + currentURL.search;

  chrome.storage.local.get(null, settings => {
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
        const exemptPages = settings['twitter'][twitterConfigs.others.exempt] || [];
        if (!exemptPages.includes(currentPath)) {
          filterPage(twitterConfigs, temp);
          setupObserver(twitterConfigs, temp);
        }
      } else if (currentHost.includes('youtube.com') && settings['extension']['youtube-toggle']) {
        youtubeListener(settings, currentHost, currentPath);
      } else if (currentHost.includes('twitch.tv') && settings['extension']['twitch-toggle']) {
        twitchListener(settings, currentHost, currentPath);
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
