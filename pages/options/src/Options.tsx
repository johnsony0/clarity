import type React from 'react';
import { useState, useEffect } from 'react';
import { PlatformSelector, CategorySection, QuickSettings, Toast } from '@extension/ui';
import { getDefaultSettings } from '@extension/shared';
import { createTimeout } from '@extension/shared';
import {
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitterSettings,
  youtubeSettings,
} from '@extension/storage';
import { Switch, Label, Field } from '@headlessui/react';

type ToastState = {
  message: string;
  type: 'success' | 'warning' | 'error';
} | null;

export const Options: React.FC = () => {
  const [platform, setPlatform] = useState('quick-settings'); // Default to "Quick Settings"
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [showToast, setShowToast] = useState<ToastState>(null);

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
      const platformConfig = getSettings(platform);
      const currentSettings = result[platform] || getDefaultSettings(platformConfig);
      setSettings(currentSettings);
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
        setShowToast({ message: `Failed with error: ${chrome.runtime.lastError.message}`, type: 'error' });
      } else {
        setShowToast({ message: 'Settings loaded!', type: 'success' });
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
        setShowToast({ message: `Failed with error: ${chrome.runtime.lastError.message}`, type: 'error' });
      } else {
        console.log('Setting updated', updatedSettings);
        setShowToast({ message: 'Settings updated successfully!', type: 'success' });
      }
    });
  };

  const renderSettings = () => {
    if (platform === 'quick-settings') {
      return <QuickSettings onSettingsChange={setShowToast} mode={1} />;
    }

    const platformSettings = getSettings(platform) as Record<string, any>;
    return Object.keys(platformSettings).map(category => (
      <CategorySection
        key={category}
        category={category}
        settings={platformSettings[category]}
        currentSettings={settings}
        onChange={handleSettingChange}
        mode={1}
      />
    ));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-font">
      <div className="w-[90%] lg:w-1/2 h-[90vh] bg-bg p-8 rounded-lg shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <PlatformSelector onPlatformChange={setPlatform} mode={1} />
          <Field>
            <div className="flex items-center">
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
      </div>
      {showToast && (
        <Toast message={showToast.message} type={showToast.type} duration={3000} onClose={() => setShowToast(null)} />
      )}
    </div>
  );
};
