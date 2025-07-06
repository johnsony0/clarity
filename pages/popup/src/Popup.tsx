import type React from 'react';
import { useState, useEffect } from 'react';
import { PlatformSelector, CategorySection, QuickSettings, Toast } from '@extension/ui';
import { createTimeout } from '@extension/shared';
import { getDefaultSettings } from '@extension/shared';
import {
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitterSettings,
  youtubeSettings,
} from '@extension/storage';
import { Switch, Label, Field, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

const PopupSettings: React.FC = () => {
  const [platform, setPlatform] = useState('quick-settings');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(['extension'], result => {
      if (result['extension']['ex-timeout']) {
        createTimeout('settings', result['extension']['ex-timeout']);
      }
    });
  }, []);

  // Load saved settings and dark mode preference on initial load
  useEffect(() => {
    // Load dark mode preference from chrome.storage.sync
    chrome.storage.sync.get(['darkMode'], result => {
      setDarkMode(result.darkMode ?? false); // Default to false if not set
    });

    // Load platform-specific settings (skip for quick-settings)
    if (platform === 'quick-settings') return;
    chrome.storage.sync.get([platform], result => {
      const defaultSettings = getSettings(platform);
      const flattenedSettings = result[platform] || getDefaultSettings(defaultSettings);
      setSettings(flattenedSettings);
    });
  }, [platform]);

  // Apply dark mode class to the <html> element and save preference when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    // Save dark mode preference to chrome.storage.sync
    chrome.storage.sync.set({ darkMode }, () => {
      if (chrome.runtime.lastError) {
        setShowToast(`Failed to save settings, error: ${chrome.runtime.lastError.message}`);
      } else {
        setShowToast('Dark/light successfully updated!');
      }
    });
  }, [darkMode]);

  const getSettings = (platform: string) => {
    switch (platform) {
      case 'extension':
        return extensionSettings;
      case 'facebook':
        return facebookSettings;
      case 'instagram':
        return instagramSettings;
      case 'twitter':
        return twitterSettings;
      case 'youtube':
        return youtubeSettings;
      default:
        console.warn(`Unsupported platform: ${platform}`);
        return {};
    }
  };

  const handleSettingChange = (id: string, value: any) => {
    const updatedSettings = { ...settings, [id]: value };
    setSettings(updatedSettings);

    // Save updated settings to chrome.storage.sync
    chrome.storage.sync.set({ [platform]: updatedSettings }, () => {
      if (chrome.runtime.lastError) {
        setShowToast(`Failed to save settings, error: ${chrome.runtime.lastError.message}`);
      } else {
        console.log('Setting updated', updatedSettings);
        setShowToast('Settings updated successfully!');
      }
    });
  };

  const renderSettings = () => {
    if (platform === 'quick-settings') {
      return <QuickSettings onSettingsChange={setShowToast} mode={0} />;
    }

    const platformSettings = getSettings(platform) as Record<string, any>;
    return Object.keys(platformSettings).map(category => (
      <CategorySection
        key={category}
        category={category}
        settings={platformSettings[category]}
        currentSettings={settings}
        onChange={handleSettingChange}
        mode={0}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-font p-4">
      <PlatformSelector onPlatformChange={setPlatform} mode={0} />
      <div className="flex justify-between mb-1">
        <Field>
          <div className="flex items-center ">
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${
                darkMode ? 'bg-secondary' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2`}>
              <span
                className={`${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <Label className="ml-2 text-sm text-heading">Dark Mode</Label>
          </div>
        </Field>
      </div>
      {renderSettings()}
      {showToast && <Toast message={showToast} duration={3000} onClose={() => setShowToast(null)} />}
    </div>
  );
};

const PopupStats: React.FC = () => {
  const [posts, setPosts] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['darkMode'], result => {
      setDarkMode(result.darkMode ?? false); // Default to false if not set
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    chrome.storage.sync.get(['post_count'], result => {
      setPosts(result['post_count']);
    });
  }, []);

  return (
    <div className="p-6 pt-10 pb-10 text-center max-w-sm bg-bg">
      <p className="text-6xl font-extrabold text-font tracking-tight pb-5 pt-5">{posts}</p>
      <h1 className="text-2xl font-semibold text-font mb-4">Posts Viewed Today</h1>
    </div>
  );
};

export const Popup: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="flex flex-col max-h-screen">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className="flex gap-4 align-items-center justify-center bg-bg p-2">
          <Tab
            key="stats"
            className={({ selected }) => `
              rounded-full px-3 py-1 text-sm/6 font-semibold text-font
              focus:outline focus:outline-secondary hover:bg-primary
              transition-all duration-200
              ${selected ? 'bg-primary' : ''}
            `}>
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
              <span>Stats</span>
            </span>
          </Tab>

          <Tab
            key="settings"
            className={({ selected }) => `
              rounded-full px-3 py-1 text-sm/6 font-semibold text-font
              focus:outline focus:outline-secondary hover:bg-primary
              transition-all duration-200
              ${selected ? 'bg-primary' : ''}
            `}>
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span>Settings</span>
            </span>
          </Tab>
        </TabList>

        <TabPanels className="flex-grow overflow-y-auto">
          <TabPanel key="stats">
            <PopupStats />
          </TabPanel>
          <TabPanel key="settings">
            <PopupSettings />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
