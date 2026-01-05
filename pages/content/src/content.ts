import {
  runBiasModel,
  runTopicModel,
  checkText,
  createDataBars,
  createTimeout,
  createDropdown,
  displayLimitReached,
  hideElement,
  hideElements,
  deleteElement,
  deleteElements,
  hideVideosPhotos,
  findElement,
} from '@extension/shared';

import type { PlatformConfig, Settings } from '@extension/shared';

const filterPost = async (
  platformConfig: PlatformConfig,
  settings: Settings,
  postContainer: HTMLElement,
  messageContainer: HTMLElement | null,
  text: string,
  currentHost: string,
) => {
  // Hide images if enabled
  if (settings['imagevideo-toggle']) {
    hideVideosPhotos(postContainer);
  }

  // Run filters on each post
  const onPostFilters = platformConfig.onPost || {};
  for (const [functionName, filters] of Object.entries(onPostFilters)) {
    for (const [filterKey, targetElements] of Object.entries(filters)) {
      if (!settings[filterKey]) continue;
      switch (functionName) {
        case 'hideElement':
          hideElement(targetElements, postContainer);
          break;
        case 'hideElements':
          hideElements(targetElements, postContainer);
          break;
      }
    }
  }
  console.log(currentHost);
  // Check post limit
  chrome.storage.local.get(['post_count_history', 'date'], result => {
    const postCount = result.post_count_history[0]?.total || 0;
    let history = result.post_count_history;
    if (!history || !history[0]) return;
    history[0].total += 1;

    if (currentHost.includes('facebook.com')) {
      history[0].facebook += 1;
    } else if (currentHost.includes('twitch.tv')) {
      history[0].twitch += 1;
    } else if (currentHost.includes('x.com')) {
      history[0].twitter += 1;
    } else if (currentHost.includes('youtube.com')) {
      history[0].youtube += 1;
    }

    chrome.storage.local.set({ post_count_history: history });
    if (settings['limit-posts-toggle'] && postCount >= settings['limit-posts-value']) {
      displayLimitReached(postContainer, settings['limit-posts-value']);
    }
  });

  let dropdownCreated = false;

  // Filter words
  settings['filtered-words']?.forEach((word: string) => {
    if (
      new RegExp(`\\b${word}\\b`, 'i').test(text) &&
      (window.location.hostname.includes('x.com') || window.location.hostname.includes('facebook.com'))
    ) {
      if (settings['content-filter-visibility'] === 'hide') {
        postContainer.style.display = 'none';
      } else if (settings['content-filter-visibility'] === 'min') {
        createDropdown(`Found keyword ${word}`, postContainer);
        dropdownCreated = true;
      }
    }
  });

  // Filter channels
  settings['filtered-channels']?.forEach((word: string) => {
    if (
      new RegExp(`\\b${word}\\b`, 'i').test(text) &&
      (window.location.hostname.includes('twitch.tv') || window.location.hostname.includes('youtube.com'))
    ) {
      if (settings['channel-filter-visibility'] === 'hide') {
        postContainer.style.display = 'none';
      } else if (settings['channel-filter-visibility'] === 'min') {
        createDropdown(`Found channel ${word}`, postContainer);
        dropdownCreated = true;
      }
    }
  });

  const error = checkText(text);
  // ML pipeline for bias detection
  if (
    !error &&
    !dropdownCreated &&
    settings['enable-bias'] &&
    (window.location.hostname.includes('x.com') || window.location.hostname.includes('facebook.com'))
  ) {
    const bias_prediction = await runBiasModel(text);
    const bias_data = {
      left: Math.round(bias_prediction[0] * 100),
      center: Math.round(bias_prediction[2] * 100),
      right: Math.round(bias_prediction[1] * 100),
    };
    const bias = Object.keys(bias_data).reduce((a, b) =>
      bias_data[a as keyof typeof bias_data] > bias_data[b as keyof typeof bias_data] ? a : b,
    );
    createDataBars(bias_data, postContainer);

    const biasThresholdExceeded =
      (bias === 'left' && bias_data['left'] > settings['bias-threshold']) ||
      (bias === 'right' && bias_data['right'] > settings['bias-threshold']);
    if (settings['bias-filter-visibility'] === 'hide' && biasThresholdExceeded) {
      postContainer.style.display = 'none';
    } else if (settings['bias-filter-visibility'] === 'min' && biasThresholdExceeded) {
      createDropdown(`Biased towards ${bias} at ${bias_data[bias]}%`, postContainer);
    }
  }
};

export const filterPage = (configs: PlatformConfig, settings: Settings) => {
  // Limit scroll if enabled
  if (settings['scroll-limit']) {
    const SCROLL_LIMIT = 0;
    function preventScrollBeyondLimit() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > SCROLL_LIMIT) {
        window.scrollTo(0, SCROLL_LIMIT); // Keep the user at the limit
      }
    }
    // Attach scroll listener
    window.addEventListener('scroll', preventScrollBeyondLimit);
  }
  if (settings['scroll-limit']) {
    document.body.style.overflow = 'hidden';
    // some twitch specific
    const el = document.querySelector<HTMLElement>('[data-a-target="root-scroller"]');
    if (el) {
      el.style.overflow = 'hidden';
    }
  }

  // Hide images if enabled
  if (settings['imagevideo-toggle']) {
    setTimeout(() => {
      hideVideosPhotos(document);
    }, 2000);
  }

  // Limit posts
  chrome.storage.local.get(['post_count_history', 'time_count_history', 'date'], result => {
    const today = new Date().toDateString();
    let postCount = result.post_count_history[0]?.total || 0;
    let timeCount = result.time_count_history[0]?.total / 60 || 0;
    if (result.date !== today) {
      // Reset post count for a new day
      console.log('Post count reset for the new day.');
      let post_history = result.post_count_history || [];
      let time_history = result.time_count_history || [];

      // Calculate gap in days (in case user didn't open browser for 2 days)
      const lastDate = new Date(result.date);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      for (let i = 0; i < Math.min(diffDays, 30); i++) {
        post_history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
        post_history.pop();
        time_history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
        time_history.pop();
      }
      console.log({ post_history, time_history });
      chrome.storage.local.set({
        post_count_history: post_history,
        time_count_history: time_history,
        date: today,
      });
    }

    if (settings['limit-posts-toggle'] && postCount >= settings['limit-posts-value']) {
      displayLimitReached(document.body, `You have hit your set post limit of ${settings['limit-posts-value']}`);
    }
    if (settings['limit-time-toggle'] && timeCount >= settings['limit-time-value']) {
      displayLimitReached(document.body, `You have hit your set time limit of ${settings['limit-time-value']} minutes`);
    }
  });

  // Handle graysccale
  if (settings['grayscale-toggle']) {
    document.body.style.filter = 'grayscale(100%)';
  }

  // Handle navigation
  if (settings['navs-toggle']) {
    document.body.style.pointerEvents = 'none';
  }

  // Hide initial elements
  for (const [functionName, filters] of Object.entries(configs.onPost || {})) {
    for (const [filterKey, filterData] of Object.entries(filters)) {
      if (settings[filterKey]) {
        switch (functionName) {
          case 'hideElement':
            hideElement(filterData);
            break;
          case 'deleteElement':
            deleteElement(filterData);
            break;
          case 'hideElements':
            hideElements(filterData);
            break;
          case 'deleteElements':
            deleteElements(filterData);
            break;
          default:
            console.warn(`Unknown function: ${functionName}`);
        }
      }
    }
  }

  const currentUrl = window.location.href;

  //specific youtube page handling, if all 3 toggles are on, just delete the secondary so video is centered.
  if (currentUrl.includes('youtube.com/watch')) {
    if (
      settings['yt-posts-livechat-toggle'] &&
      settings['yt-posts-suggestions-toggle'] &&
      settings['yt-posts-mixes-toggle']
    ) {
      const pageManager = document.querySelector<HTMLElement>('ytd-page-manager');
      if (pageManager) {
        pageManager.style.overflowX = 'hidden';
        pageManager.style.setProperty('overflow-x', 'hidden', 'important');
      }
      deleteElements({ selector: '[id=secondary]', type: 'attribute', parents: 0 });
    }
  }

  const currentPath = window.location.pathname;
  //page specific hides
  for (const [category, functions] of Object.entries(configs.onOpen || {})) {
    // if url is incorrect and not _ we skip
    if (!currentPath.startsWith(functions.url) && functions.url != '_') {
      continue;
    }
    for (const [functionName, functionData] of Object.entries(functions)) {
      for (const [filterKey, filterData] of Object.entries(functionData)) {
        if (!settings[filterKey]) continue;
        switch (functionName) {
          case 'hideElement':
            hideElement(filterData);
            break;
          case 'deleteElement':
            deleteElement(filterData);
            break;
          case 'hideElements':
            hideElements(filterData);
            break;
          case 'deleteElements':
            deleteElements(filterData);
            break;
          default:
            console.warn(`Unknown function: ${functionName}`);
        }
      }
    }
  }

  if (settings[configs.others.createTimeout.selector]) {
    createTimeout(configs.others.createTimeout.text, settings[configs.others.createTimeout.selector]);
  }
};

// get text and message container
export const processPost = (
  platformConfig: PlatformConfig,
  settings: Settings,
  postContainer: HTMLElement,
  currentHost: string,
) => {
  for (const [filterKey, filterData] of Object.entries(platformConfig.otherContainers)) {
    if (!settings[filterKey]) continue;
    hideElement(filterData, postContainer);
  }
  const messageContainer = findElement(postContainer, platformConfig.messageContainer);
  const text = messageContainer ? messageContainer.innerText : '';
  if (text && text.length > 0) {
    filterPost(platformConfig, settings, postContainer, messageContainer, text, currentHost);
  }
};
