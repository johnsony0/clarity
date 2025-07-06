import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@headlessui/react';
import {
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitterSettings,
  youtubeSettings,
} from '@extension/storage';

interface QuickSettingsProps {
  onSettingsChange: (showToast: string) => void;
  mode: number;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({ onSettingsChange, mode }) => {
  const [sliderValue, setSliderValue] = useState(3);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    ai: false,
    messages: false,
    search: false,
  });

  // Load saved slider value and toggle states on initial load
  useEffect(() => {
    chrome.storage.sync.get(['sliderValue', 'toggleStates'], result => {
      if (result.sliderValue !== undefined) {
        setSliderValue(result.sliderValue);
      }
      if (result.toggleStates !== undefined) {
        setToggleStates(result.toggleStates);
      }
    });
  }, []);

  // Get all platform settings
  const getAllPlatformSettings = () => {
    return {
      extension: extensionSettings,
      facebook: facebookSettings,
      instagram: instagramSettings,
      twitter: twitterSettings,
      youtube: youtubeSettings,
    };
  };

  // Handle slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
    updateSettingsBasedOnSlider(value);
    chrome.storage.sync.set({ sliderValue: value });
  };

  const updateSettingsBasedOnSlider = (value: number) => {
    const allPlatformSettings = getAllPlatformSettings() as Record<string, any>;

    // Loop through each platform's settings
    Object.keys(allPlatformSettings).forEach(platform => {
      chrome.storage.sync.get([platform], result => {
        const existingSettings = result[platform] || {}; // Load existing settings
        const updatedSettings = { ...existingSettings }; // Create a copy to modify

        const platformSettings = allPlatformSettings[platform];
        Object.keys(platformSettings).forEach(category => {
          platformSettings[category].forEach((setting: any) => {
            if (setting.rating !== undefined) {
              if (!toggleStates[setting.tag]) {
                if (setting.type === 'checkbox') {
                  updatedSettings[setting.id] = setting.rating <= value;
                } else if (setting.type === 'number') {
                  if (setting.id === 'limit-value') {
                    updatedSettings[setting.id] = setting.default - 100 * value;
                  } else {
                    if (value > 3) {
                      updatedSettings[setting.id] = 15 * (value - 3);
                    } else {
                      updatedSettings[setting.id] = 0;
                    }
                  }
                }
              }
            }
          });
        });
        // Save updated settings for the current platform
        chrome.storage.sync.set({ [platform]: updatedSettings }, () => {
          if (chrome.runtime.lastError) {
            onSettingsChange(`Failed to save settings, error: ${chrome.runtime.lastError.message}`);
          } else {
            console.log(`Settings updated for ${platform}:`, updatedSettings);
            onSettingsChange('Settings updated successfully!');
          }
        });
      });
    });
  };

  const handleToggleTag = (tag: string) => {
    const newToggleStates = { ...toggleStates, [tag]: !toggleStates[tag] };
    setToggleStates(newToggleStates);

    // Save updated toggle states to chrome.storage.sync
    chrome.storage.sync.set({ toggleStates: newToggleStates }, () => {
      console.log(`Toggle state for ${tag} updated:`, newToggleStates[tag]);
    });

    const allPlatformSettings = getAllPlatformSettings() as Record<string, any>;

    // Loop through each platform's settings
    Object.keys(allPlatformSettings).forEach(platform => {
      chrome.storage.sync.get([platform], result => {
        const existingSettings = result[platform] || {}; // Load existing settings
        const updatedSettings = { ...existingSettings }; // Create a copy to modify

        const platformSettings = allPlatformSettings[platform];
        Object.keys(platformSettings).forEach(category => {
          platformSettings[category].forEach((setting: any) => {
            if (setting.tag === tag) {
              updatedSettings[setting.id] = toggleStates[tag]; // Update only the relevant setting
            }
          });
        });

        // Save updated settings for the current platform
        chrome.storage.sync.set({ [platform]: updatedSettings }, () => {
          if (chrome.runtime.lastError) {
            onSettingsChange(`Failed to save settings, error: ${chrome.runtime.lastError.message}`);
          } else {
            console.log(`Settings updated for ${platform}:`, updatedSettings);
            onSettingsChange('Settings updated successfully!');
          }
        });
      });
    });
  };

  interface ChoiceProps {
    tag: string;
    path: React.ReactNode;
    name: string;
    toggleStates: Record<string, boolean>;
    handleToggleTag: (tag: string) => void;
  }

  const Choice: React.FC<ChoiceProps> = ({ tag, path, name, toggleStates, handleToggleTag }) => {
    // Fix 1: Explicitly return JSX
    // Fix 2: Use bracket notation for toggleStates[tag]
    return (
      <Button
        onClick={() => handleToggleTag(tag)}
        className={`relative flex items-center justify-center p-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
          toggleStates[tag] ? 'bg-secondary text-heading' : 'bg-gray-300 text-gray-800'
        }`}>
        <div className="flex flex-col items-center space-y-2">
          <div className={`p-2 rounded-full`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              {path}
            </svg>
          </div>
          <span className="font-medium text-base">{name}</span>
        </div>
      </Button>
    );
  };

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold text-heading ${mode ? 'mb-4' : 'mb-0'}`}>Quick Settings</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="slider" className="block text-sm font-medium text-heading">
            Adjust Settings Rating
          </label>
          <input
            id="slider"
            type="range"
            min="1"
            max="5"
            value={sliderValue}
            onChange={handleSliderChange}
            className="mt-1 block w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>None</span>
            <span className="flex-grow text-center">Current Value: {sliderValue}</span>
            <span>Max</span>
          </div>
        </div>
        <div
          className={`grid w-full ${mode === 0 ? 'grid-cols-2 gap-2 p-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'}`}>
          <Choice
            key="messages"
            tag="messages"
            path={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            }
            name="Enable Messages"
            toggleStates={toggleStates}
            handleToggleTag={handleToggleTag}
          />
          <Choice
            key="search"
            tag="search"
            path={<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
            name="Enable Search"
            toggleStates={toggleStates}
            handleToggleTag={handleToggleTag}
          />
          <Choice
            key="ai"
            tag="ai"
            path={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            }
            name="Disable AI/ML"
            toggleStates={toggleStates}
            handleToggleTag={handleToggleTag}
          />
        </div>
      </div>
    </div>
  );
};
