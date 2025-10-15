import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@headlessui/react';
import {
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitchSettings,
  twitterSettings,
  youtubeSettings,
  tagMap,
} from '@extension/storage';

const quickSettingsMessage = [
  { value: 1, label: '1', features: ['Hide biased posts. Add scroll limits'] },
  { value: 2, label: '2', features: ['Hide short form content and main navigation'] },
  {
    value: 3,
    label: '3',
    features: ['Hide messages, searching, post menus, and post actions (comments, reacts, etc)'],
  },
  {
    value: 4,
    label: '4',
    features: ['Hide elements on other profiles/pages, live chats, search filters. Adds a timeout'],
  },
  { value: 5, label: '5', features: ['Hide user profile button. Add grayscale'] },
  { value: 6, label: '6', features: ['Hide images/videos. Navigation links no longer work'] },
  { value: 7, label: '7', features: ['Hide the entire feed'] },
];

type ToastState = {
  message: string;
  type: 'success' | 'warning' | 'error';
} | null;

type quickSettingSelection = {
  value: number;
  label: string;
  features: string[];
};

interface QuickSettingsProps {
  onSettingsChange: (showToast: ToastState) => void;
  mode: number;
}

// QuickSettings page to adjust settings with a slider and toggle buttons
export const QuickSettings: React.FC<QuickSettingsProps> = ({ onSettingsChange, mode }) => {
  const [slider, setSlider] = useState(quickSettingsMessage[3]);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    ai: false,
    messages: false,
    search: false,
  });

  useEffect(() => {
    chrome.storage.sync.get(['sliderValue', 'toggleStates'], result => {
      if (result.sliderValue !== undefined) {
        const initialSelection = quickSettingsMessage.find(item => item.value === result.sliderValue);
        if (initialSelection) {
          setSlider(initialSelection);
        }
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
      twitch: twitchSettings,
      twitter: twitterSettings,
      youtube: youtubeSettings,
    };
  };

  const getFeaturesByValue = (value: number) => {
    const allFeatures: { feature: string; isNew: boolean }[] = [];
    const selectedIndex = quickSettingsMessage.findIndex(item => item.value === value);
    // Iterate backwards from the selected index to 0
    for (let i = selectedIndex; i >= 0; i--) {
      const isNew = i === selectedIndex;
      quickSettingsMessage[i].features.forEach(feature => {
        allFeatures.push({ feature, isNew });
      });
    }
    return allFeatures;
  };

  // Handle slider change
  const handleSliderChange = (selection: quickSettingSelection) => {
    setSlider(selection);
    updateSettingsBasedOnSlider(selection.value);
    chrome.storage.sync.set({ sliderValue: selection.value });
  };

  const updateSettingsBasedOnSlider = (value: number) => {
    const allPlatformSettings = getAllPlatformSettings() as Record<string, any>;

    // Loop through each platform's settings
    Object.keys(allPlatformSettings).forEach(platform => {
      chrome.storage.sync.get([platform], result => {
        const existingSettings = result[platform] || {};
        const updatedSettings = { ...existingSettings };

        const platformSettings = allPlatformSettings[platform];
        Object.keys(platformSettings).forEach(category => {
          platformSettings[category].forEach((setting: any) => {
            if (setting.tag !== undefined) {
              if (!toggleStates[setting.tag]) {
                if (setting.type === 'checkbox') {
                  if (setting.tag in tagMap) {
                    updatedSettings[setting.id] = tagMap[setting.tag as keyof typeof tagMap] <= value;
                  } else console.warn(`Non-existent tag:${setting.tag}`);
                } else if (setting.type === 'number') {
                  if (setting.id === 'limit-value') {
                    updatedSettings[setting.id] = setting.default - 100 * value;
                  } else if (setting.tag === 'timeout') {
                    if (value === 5) {
                      updatedSettings[setting.id] = 5;
                    } else if (value === 6) {
                      updatedSettings[setting.id] = 15;
                    } else if (value === 7) {
                      updatedSettings[setting.id] = 30;
                    } else {
                      updatedSettings[setting.id] = 0;
                    }
                  } else {
                    //this is the model thresholds
                    updatedSettings[setting.id] = 50;
                  }
                }
              }
            }
          });
        });
        // Save updated settings for the current platform
        chrome.storage.sync.set({ [platform]: updatedSettings }, () => {
          if (chrome.runtime.lastError) {
            onSettingsChange({ message: `Failed with error: ${chrome.runtime.lastError.message}`, type: 'error' });
          } else {
            console.log(`Settings updated for ${platform}:`, updatedSettings);
            {
              mode
                ? onSettingsChange({ message: 'Settings updated successfully!', type: 'success' })
                : onSettingsChange({
                    message: 'Settings updated successfully, reload site to see changes!',
                    type: 'success',
                  });
            }
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
            if (setting.tag === tag && setting.type === 'checkbox') {
              updatedSettings[setting.id] = toggleStates[tag]; // Update only the relevant setting
            }
          });
        });

        // Save updated settings for the current platform
        chrome.storage.sync.set({ [platform]: updatedSettings }, () => {
          if (chrome.runtime.lastError) {
            onSettingsChange({ message: `Failed with error: ${chrome.runtime.lastError.message}`, type: 'error' });
          } else {
            console.log(`Settings updated for ${platform}:`, updatedSettings);
            onSettingsChange({ message: 'Settings updated successfully!', type: 'success' });
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
      <h2 className={`text-xl font-semibold text-heading mb-4`}>Quick Settings</h2>
      <div className="space-y-4">
        <div className="w-full">
          <div className="flex justify-between space-x-1 mb-4">
            {quickSettingsMessage.map(item => (
              <div
                key={item.value}
                onClick={() => handleSliderChange(item)}
                className={`
                  flex-1 flex items-center justify-center p-3 rounded-lg text-center
                  font-semibold text-sm transition-all duration-200 ease-in-out
                  cursor-pointer border-2
                  ${
                    slider.value === item.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }
                `}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <ul>
              {getFeaturesByValue(slider.value).map((featureItem, index) => (
                <li key={index} className="mb-1">
                  {featureItem.isNew ? (
                    <span className="font-bold">{featureItem.feature}</span>
                  ) : (
                    <span>{featureItem.feature}</span>
                  )}
                </li>
              ))}
            </ul>
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
