import { useState, useEffect } from 'react';
import { PlatformSelector, CategorySection, QuickSettings, Toast } from '../../lib';
import { getDefaultSettings } from '@extension/shared';
import { createTimeout } from '@extension/shared';
import {
  extensionSettings,
  facebookSettings,
  instagramSettings,
  twitchSettings,
  twitterSettings,
  youtubeSettings,
} from '@extension/storage';
import { Switch, Label, Field } from '@headlessui/react';
type ToastState = {
  message: string;
  type: 'success' | 'warning' | 'error';
} | null;

type SettingsProps = {
  mode: number; // 0 for options page, 1 for popup
};

// Main settings component
export const Setting: React.FC<SettingsProps> = ({ mode }) => {
  const [platform, setPlatform] = useState('quick-settings'); // Default to "Quick Settings"
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [powerState, setPowerState] = useState(true);
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

    chrome.storage.sync.get(['powerState'], result => {
      setPowerState(result.powerState ?? true); // Default to true if not set
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
      }
    });
  }, [darkMode]);

  useEffect(() => {
    // Save power preference to chrome.storage.sync
    chrome.storage.sync.set({ powerState }, () => {
      if (chrome.runtime.lastError) {
        setShowToast({ message: `Failed with error: ${chrome.runtime.lastError.message}`, type: 'error' });
      }
    });
  }, [powerState]);

  const getSettings = (platform: string) => {
    switch (platform) {
      case 'extension':
        return extensionSettings;
      case 'facebook':
        return facebookSettings;
      case 'instagram':
        return instagramSettings;
      case 'twitch':
        return twitchSettings;
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
      return <QuickSettings onSettingsChange={setShowToast} mode={mode} />;
    }

    const platformSettings = getSettings(platform) as Record<string, any>;
    return Object.keys(platformSettings).map(category => (
      <CategorySection
        key={category}
        category={category}
        settings={platformSettings[category]}
        currentSettings={settings}
        onChange={handleSettingChange}
        mode={mode}
      />
    ));
  };

  //renders the platform select, dark mode toggle, and settings
  return mode === 0 ? (
    <div className="min-h-screen text-font">
      <div
        style={{
          backgroundImage: `url(${chrome.runtime.getURL('optionsbackground.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="h-screen w-screen flex items-center justify-center ">
        <div className="w-[90%] lg:w-1/2 h-[90vh] bg-bg p-8 rounded-lg shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <PlatformSelector onPlatformChange={setPlatform} mode={mode} />
            <Field>
              <div className="flex items-center mb-4">
                <Switch
                  checked={powerState}
                  onChange={setPowerState}
                  className={`${
                    powerState ? 'bg-secondary' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2`}>
                  <span
                    className={`${
                      powerState ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
              </div>
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
    </div>
  ) : mode === 1 ? (
    <div className="min-h-screen flex flex-col bg-bg text-font p-4">
      <Field className="flex justify-between items-center w-full">
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
        <div className="flex items-center">
          <Switch
            checked={powerState}
            onChange={setPowerState}
            className={`${
              powerState ? 'bg-secondary' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2`}>
            <span
              className={`${
                powerState ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
          </svg>
        </div>
      </Field>
      <PlatformSelector onPlatformChange={setPlatform} mode={mode} />
      {renderSettings()}
      {showToast && (
        <Toast message={showToast.message} type={showToast.type} duration={3000} onClose={() => setShowToast(null)} />
      )}
    </div>
  ) : (
    <></>
  );
};
