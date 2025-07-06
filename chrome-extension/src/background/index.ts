import 'webextension-polyfill';
import {
  exampleThemeStorage,
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitterSettings,
  youtubeSettings,
} from '@extension/storage';
import { getDefaultSettings } from '@extension/shared';

interface SettingCategory {
  [key: string]: Array<any>; // Looser: any array
  // Or more specific: [key: string]: Array<SettingDefinition>;
  // where SettingDefinition is a union type of your different setting objects
}

interface PlatformSettings {
  [key: string]: SettingCategory; // This is the index signature for platform keys
}

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

const allPlatformSettingsConfig: PlatformSettings = {
  // Renamed to avoid confusion with actual stored settings
  extension: extensionSettings, // Your extensionSettings from previous example
  facebook: facebookSettings,
  instagram: instagramSettings,
  twitter: twitterSettings,
  youtube: youtubeSettings,
};

chrome.runtime.onInstalled.addListener(async details => {
  // Made the listener async

  // --- 1. Initial Installation Setup ---
  if (details.reason === 'install') {
    const initSettings = {
      darkMode: false,
      slider: 3,
      toggleStates: {
        bias: false,
        messages: false,
        ai: false,
      },
    };
    await chrome.storage.sync.set(initSettings); // Use await
    console.log('Default initial settings set.');
    // For a fresh install, we can then proceed to apply the detailed defaults
    // based on the newly set slider and toggleStates.
  }

  // --- 2. Load Global State (slider, toggleStates) ---
  // This part runs on both install and update.
  // Use a default object to ensure these keys always exist from storage or use their defaults.
  let globalSettings = await chrome.storage.sync.get({
    slider: 3, // Default if not found in storage
    toggleStates: {
      // Default if not found in storage
      bias: false,
      messages: false,
      ai: false,
    },
    darkMode: false, // Include darkMode here too if it's a top-level setting
  });

  const value = globalSettings.slider as number; // `value` refers to slider value
  const toggleStates = globalSettings.toggleStates; // `toggleStates` object

  console.log('Global settings loaded (slider, toggleStates):', { value, toggleStates });

  // --- 3. Process Each Platform's Settings ---
  for (const platform of Object.keys(allPlatformSettingsConfig)) {
    try {
      // Load existing settings for the current platform
      // If 'platform' key doesn't exist in storage, result[platform] will be undefined.
      const storedPlatformData = await chrome.storage.sync.get(platform);
      let currentPlatformSettings: { [key: string]: any } = storedPlatformData[platform] || {}; // Initialize with existing or empty object

      // Iterate through the categories (e.g., 'General') defined for this platform
      const categories = allPlatformSettingsConfig[platform]; // e.g., extensionSettings.General

      // Flatten settings from all categories for the current platform
      const allSettingDefinitionsForPlatform = Object.values(categories).flat();

      for (const setting of allSettingDefinitionsForPlatform) {
        // *** THE CRUCIAL FIX: ONLY APPLY DEFAULT IF THE SETTING IS NOT YET DEFINED ***
        if (typeof currentPlatformSettings[setting.id] === 'undefined') {
          // Check if setting has a rating and apply rating-based logic
          if (setting.rating !== undefined) {
            // Ensure `toggleStates[setting.tag]` is a boolean, default to false if undefined
            // This ensures the condition evaluates correctly even if setting.tag or toggleStates is missing
            const isToggleActive = toggleStates && toggleStates[setting.tag] ? true : false;

            if (!isToggleActive) {
              // Apply if not specifically toggled off
              if (setting.type === 'checkbox') {
                currentPlatformSettings[setting.id] = setting.rating <= value;
              } else if (setting.type === 'number') {
                if (setting.id === 'limit-value') {
                  // Specific ID logic
                  currentPlatformSettings[setting.id] = (setting.default as number) - 100 * value;
                } else {
                  // General number logic
                  if (value > 3) {
                    currentPlatformSettings[setting.id] = 15 * (value - 3);
                  } else {
                    currentPlatformSettings[setting.id] = 0;
                  }
                }
              }
            }
          } else {
            // If setting has no rating but has a 'default' property, apply it if missing
            if (typeof setting.default !== 'undefined') {
              currentPlatformSettings[setting.id] = setting.default;
            }
          }
        }
      }
      // Save the *updated* settings for this specific platform back to storage
      await chrome.storage.sync.set({ [platform]: currentPlatformSettings });
      console.log(`Settings processed and saved for ${platform}:`, currentPlatformSettings);
    } catch (error) {
      console.error(`Error processing settings for platform ${platform}:`, error);
    }
  }
  console.log('All settings update/initialization complete.');
});

console.log('Background loaded');
