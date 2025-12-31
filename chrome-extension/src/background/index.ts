import 'webextension-polyfill';
import {
  exampleThemeStorage,
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitchSettings,
  twitterSettings,
  youtubeSettings,
  tagMap,
} from '@extension/storage';

interface SettingCategory {
  [key: string]: Array<any>;
}

interface PlatformSettings {
  [key: string]: SettingCategory;
}

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

type ActiveTrack = { tabId: number | null; start: number | null; platform: string | null };
const active: ActiveTrack = { tabId: null, start: null, platform: null };

const supportedPlatformKey = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.includes('facebook.com')) return 'facebook';
    if (host.includes('x.com') || host.includes('twitter.com')) return 'twitter';
    if (host.includes('youtube.com')) return 'youtube';
    if (host.includes('twitch.tv')) return 'twitch';
  } catch (e) {
    return null;
  }
  return null;
};

const persistActiveTime = async (seconds: number, platform: string | null) => {
  if (seconds <= 0) return;
  const keys = await chrome.storage.local.get(['time_count_history', 'date']);
  const today = new Date().toDateString();
  let history =
    keys.time_count_history ||
    Array.from({ length: 365 }, () => ({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 }));

  if (keys.date !== today) {
    const lastDate = keys.date ? new Date(keys.date) : new Date();
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    for (let i = 0; i < Math.min(diffDays, 30); i++) {
      history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
      history.pop();
    }
  }

  history[0].total += seconds;
  if (platform && platform in history[0]) {
    history[0][platform] += seconds;
  }

  await chrome.storage.local.set({ time_count_history: history, date: today });
};

const stopTrackingAndPersist = async () => {
  if (!active.start) return;
  const elapsed = Math.floor((Date.now() - active.start) / 1000);
  await persistActiveTime(elapsed, active.platform);
  active.start = null;
  active.tabId = null;
  active.platform = null;
};

// When the active tab changes, persist previous and start a new timer if applicable
chrome.tabs.onActivated.addListener(async info => {
  try {
    // persist previous
    await stopTrackingAndPersist();
    const tab = await chrome.tabs.get(info.tabId);
    const platform = supportedPlatformKey(tab.url || undefined);
    if (platform) {
      active.tabId = info.tabId;
      active.start = Date.now();
      active.platform = platform;
    }
  } catch (e) {
    console.warn('onActivated track error', e);
  }
});

// When window focus changes, stop or start timers
chrome.windows.onFocusChanged.addListener(async winId => {
  try {
    if (winId === chrome.windows.WINDOW_ID_NONE) {
      await stopTrackingAndPersist();
      return;
    }
    const tabs = await chrome.tabs.query({ active: true, windowId: winId });
    const tab = tabs && tabs[0];
    if (tab) {
      const platform = supportedPlatformKey(tab.url);
      if (platform && active.tabId !== tab.id) {
        await stopTrackingAndPersist();
        active.tabId = tab.id || null;
        active.start = Date.now();
        active.platform = platform;
      }
    }
  } catch (e) {
    console.warn('onFocusChanged track error', e);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;

  await stopTrackingAndPersist();

  const platform = supportedPlatformKey(changeInfo.url);
  if (platform && tab.active) {
    active.tabId = tabId;
    active.start = Date.now();
    active.platform = platform;
  }
});

self.addEventListener('unload', () => {
  if (active.start) {
    const elapsed = Math.floor((Date.now() - (active.start || Date.now())) / 1000);
    chrome.storage.local.get(['time_count_history', 'date']).then(async keys => {
      await persistActiveTime(elapsed, active.platform);
    });
  }
});

const allPlatformSettingsConfig: PlatformSettings = {
  extension: extensionSettings,
  facebook: facebookSettings,
  instagram: instagramSettings,
  twitch: twitchSettings,
  twitter: twitterSettings,
  youtube: youtubeSettings,
};

//Gemini wrote this and it just works 🤷 ill figure this out another day
chrome.runtime.onInstalled.addListener(async details => {
  // Made the listener async

  // --- 1. Initial Installation Setup ---
  const createEmptyDay = () => ({
    total: 0,
    facebook: 0,
    twitter: 0,
    youtube: 0,
    twitch: 0,
  });
  if (details.reason === 'install') {
    const initSettings = {
      powerState: true,
      darkMode: false,
      sliderValue: 4,
      toggleStates: {
        search: false,
        messages: false,
        ai: false,
      },
      post_count_history: Array.from({ length: 365 }, () => createEmptyDay()),
      time_count_history: Array.from({ length: 365 }, () => createEmptyDay()),
      date: new Date().toDateString(),
    };
    await chrome.storage.local.set(initSettings);
    console.log('Default initial settings set.');
  }

  await chrome.storage.local.get(null).then(items => {
    console.log('Current storage items:', items);
  });

  // --- 2. Load Global State (slider, toggleStates) ---
  // This part runs on both install and update.
  // Use a default object to ensure these keys always exist from storage or use their defaults.
  let globalSettings = await chrome.storage.local.get({
    sliderValue: 4, // Default if not found in storage
    toggleStates: {
      // Default if not found in storage
      search: false,
      messages: false,
      ai: false,
    },
    darkMode: false, // Include darkMode here too if it's a top-level setting
  });

  const value = globalSettings.sliderValue as number; // `value` refers to slider value
  const toggleStates = globalSettings.toggleStates; // `toggleStates` object

  console.log('Global settings loaded (slider, toggleStates):', { value, toggleStates });

  // --- 3. Process Each Platform's Settings ---
  for (const platform of Object.keys(allPlatformSettingsConfig)) {
    try {
      // Load existing settings for the current platform
      // If 'platform' key doesn't exist in storage, result[platform] will be undefined.
      const storedPlatformData = await chrome.storage.local.get(platform);
      let currentPlatformSettings: { [key: string]: any } = storedPlatformData[platform] || {}; // Initialize with existing or empty object
      // Iterate through the categories (e.g., 'General') defined for this platform
      const categories = allPlatformSettingsConfig[platform]; // e.g., extensionSettings.General
      // Flatten settings from all categories for the current platform
      const allSettingDefinitionsForPlatform = Object.values(categories).flat();

      for (const setting of allSettingDefinitionsForPlatform) {
        if (typeof currentPlatformSettings[setting.id] === 'undefined') {
          // Check if setting has a tag and apply tag-based logic
          if (setting.tag !== undefined) {
            if (!toggleStates[setting.tag]) {
              // Apply if not specifically toggled
              if (setting.type === 'checkbox') {
                if (setting.tag in tagMap) {
                  currentPlatformSettings[setting.id] = tagMap[setting.tag as keyof typeof tagMap] <= value;
                } else console.warn(`Non-existent tag:${setting.tag}`);
              } else if (setting.type === 'select') {
                currentPlatformSettings[setting.id] = setting.default;
              } else if (setting.type === 'number') {
                if (setting.id === 'limit-value') {
                  currentPlatformSettings[setting.id] = setting.default - 100 * value;
                } else if (setting.tag === 'timeout') {
                  if (value === 5) {
                    currentPlatformSettings[setting.id] = 5;
                  } else if (value === 6) {
                    currentPlatformSettings[setting.id] = 15;
                  } else if (value === 7) {
                    currentPlatformSettings[setting.id] = 30;
                  } else {
                    currentPlatformSettings[setting.id] = 0;
                  }
                } else {
                  //this is the model thresholds
                  currentPlatformSettings[setting.id] = 50;
                }
              }
            }
          } else {
            // If setting has no tag but has a 'default' property, apply it if missing
            if (typeof setting.default !== 'undefined') {
              currentPlatformSettings[setting.id] = setting.default;
            }
          }
        }
      }
      // Save the *updated* settings for this specific platform back to storage
      await chrome.storage.local.set({ [platform]: currentPlatformSettings });
      console.log(`Settings processed and saved for ${platform}:`, currentPlatformSettings);
    } catch (error) {
      console.error(`Error processing settings for platform ${platform}:`, error);
    }
  }
  console.log('All settings update/initialization complete.');
});
