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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRACK_TIME') {
    handleTimeTracking(message);
    sendResponse({ status: 'success' });
  }
});

async function handleTimeTracking(message: { platform: string; seconds: number }) {
  const data = await chrome.storage.local.get(['time_count_history']);
  let history = data.time_count_history || [];

  history[0][message.platform] = (history[0][message.platform] || 0) + message.seconds;
  history[0].total = (history[0].total || 0) + message.seconds;

  await chrome.storage.local.set({ time_count_history: history });
}

function dailyResetCheck() {
  chrome.storage.local.get(['post_count_history', 'time_count_history', 'date'], result => {
    const today = new Date().toDateString();
    if (result.date !== today) {
      let post_history = result.post_count_history || [];
      let time_history = result.time_count_history || [];

      // Calculate gap in days (in case user didn't open browser for 2 days)
      const lastDate = new Date(result.date);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      for (let i = 0; i < Math.min(diffDays, 30); i++) {
        post_history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
        time_history.unshift({ total: 0, facebook: 0, twitter: 0, youtube: 0, twitch: 0 });
        post_history.pop();
        time_history.pop();
      }
      chrome.storage.local.set({
        post_count_history: post_history,
        time_count_history: time_history,
        date: today,
      });
    }
  });
}

chrome.runtime.onStartup.addListener(dailyResetCheck);

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
                if (setting.id === 'limit-posts-value') {
                  currentPlatformSettings[setting.id] = setting.default - 100 * value;
                } else if (setting.id == 'limit-time-value') {
                  currentPlatformSettings[setting.id] = setting.default - 60 * value;
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
