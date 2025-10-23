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

  // Check post limit
  chrome.storage.sync.get(['post_count', 'date'], result => {
    const postCount = result.post_count || 0;
    chrome.storage.sync.set({ post_count: postCount + 1 });
    if (settings['limit-toggle'] && postCount >= settings['limit-value']) {
      console.warn('Post limit exceeded!');
      displayLimitReached(postContainer, settings['limit-value']);
    }
  });

  let dropdownCreated = false;

  // Filter words
  settings['filtered-words'].forEach((word: string) => {
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

  //only run the ML if there isn't already a dropdown, we can find the message, the setting for the model is on and the website is x or facebook
  if (
    !dropdownCreated &&
    messageContainer &&
    settings['enable-topic'] &&
    (window.location.hostname.includes('x.com') || window.location.hostname.includes('facebook.com'))
  ) {
    // ML pipeline for topic classification
    const topic_prediction = await runTopicModel(text);
    const topic_data = {
      tech: Math.round(topic_prediction[0] * 100),
      sports: Math.round(topic_prediction[1] * 100),
      politics: Math.round(topic_prediction[2] * 100),
      gaming: Math.round(topic_prediction[3] * 100),
      food: Math.round(topic_prediction[4] * 100),
      business: Math.round(topic_prediction[5] * 100),
    };
    const bias = Object.keys(topic_data).reduce((a, b) =>
      topic_data[a as keyof typeof topic_data] > topic_data[b as keyof typeof topic_data] ? a : b,
    );

    const topicThresholdExceeded =
      (bias === 'tech' && settings['enable-tech'] && topic_data['tech'] > settings['topic-threshold']) ||
      (bias === 'sports' && settings['enable-sports'] && topic_data['sports'] > settings['topic-threshold']) ||
      (bias === 'politics' && settings['enable-politics'] && topic_data['politics'] > settings['topic-threshold']) ||
      (bias === 'gaming' && settings['enable-gaming'] && topic_data['gaming'] > settings['topic-threshold']) ||
      (bias === 'food' && settings['enable-food'] && topic_data['food'] > settings['topic-threshold']) ||
      (bias === 'business' && settings['enable-business'] && topic_data['business'] > settings['topic-threshold']);
    if (settings['topic-filter-visibility'] === 'hide' && topicThresholdExceeded) {
      postContainer.style.display = 'none';
    } else if (settings['topic-filter-visibility'] === 'min' && topicThresholdExceeded) {
      createDropdown(`Biased towards ${bias} at ${topic_data[bias]}%`, postContainer);
      dropdownCreated = true;
    }
  }

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
    // artifical default scroll_limit given
    const SCROLL_LIMIT = 10000;
    function preventScrollBeyondLimit() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > SCROLL_LIMIT) {
        window.scrollTo(0, SCROLL_LIMIT); // Keep the user at the limit
      }
    }
    // Attach scroll listener
    window.addEventListener('scroll', preventScrollBeyondLimit);
  }

  // Hide images if enabled
  if (settings['imagevideo-toggle']) {
    setTimeout(() => {
      hideVideosPhotos(document);
    }, 2000);
  }

  // Limit posts
  chrome.storage.sync.get(['post_count', 'date'], result => {
    const today = new Date().toDateString();
    let postCount = result.post_count || 0;
    console.log(`Count currently at ${postCount}`);

    if (result.date !== today) {
      // Reset post count for a new day
      chrome.storage.sync.set({ post_count: 0, date: today });
      postCount = 0;
      console.log('Post count reset for the new day.');
    }

    if (settings['limit-toggle'] && postCount >= settings['limit-value']) {
      console.warn('Post limit exceeded!');
      displayLimitReached(document.body, settings['limit-value']);
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
            hideElement(filterData, document);
            break;
          case 'hideElements':
            hideElements(filterData, document);
            break;
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
      deleteElement({ selector: '[id=secondary]', type: 'attribute', parents: 0 });
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
export const processPost = (platformConfig: PlatformConfig, settings: Settings, postContainer: HTMLElement) => {
  for (const [filterKey, filterData] of Object.entries(platformConfig.otherContainers)) {
    if (!settings[filterKey]) continue;
    hideElement(filterData, postContainer);
  }
  const messageContainer = findElement(postContainer, platformConfig.messageContainer);
  const text = messageContainer ? messageContainer.innerText : '';
  console.log(text);
  filterPost(platformConfig, settings, postContainer, messageContainer, text);
};
