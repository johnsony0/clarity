import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

// Define a type for your platform options
interface PlatformOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const platformOptions: PlatformOption[] = [
  {
    value: 'quick-settings',
    label: 'Quick Settings',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-sliders"
        viewBox="0 0 16 16">
        <path
          fill-rule="evenodd"
          d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
        />
      </svg>
    ),
  },
  {
    value: 'extension',
    label: 'Shared',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-gear-wide-connected"
        viewBox="0 0 16 16">
        <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z" />
      </svg>
    ),
  },
  {
    value: 'facebook',
    label: 'Facebook',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-facebook"
        viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
      </svg>
    ),
  },
  {
    value: 'twitch',
    label: 'Twitch',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-twitch"
        viewBox="0 0 16 16">
        <path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z" />
        <path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z" />
      </svg>
    ),
  },
  {
    value: 'twitter',
    label: 'Twitter',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-twitter"
        viewBox="0 0 16 16">
        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
      </svg>
    ),
  },
  {
    value: 'youtube',
    label: 'Youtube',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-youtube"
        viewBox="0 0 16 16">
        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
      </svg>
    ),
  },
];

// Helper to find the currently selected option object
const findSelectedOption = (selectedValue: string) => {
  return platformOptions.find(opt => opt.value === selectedValue) || platformOptions[0];
};

interface PlatformSelectorProps {
  onPlatformChange: (platform: string) => void;
  mode: number;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onPlatformChange, mode }) => {
  // Use a state to manage the selected platform value for the Listbox
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0].value);

  const handleListboxChange = (value: string) => {
    setSelectedPlatform(value);
    onPlatformChange(value); // Call the parent handler
  };

  const gotoSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  const currentSelectedOption = findSelectedOption(selectedPlatform);

  return (
    <div className={`${mode ? 'mb-4 mt-4' : 'mb-1'} relative`}>
      <label htmlFor="platform-listbox" className="block text-lg font-bold">
        Select Platform
      </label>

      <Listbox value={selectedPlatform} onChange={handleListboxChange}>
        <ListboxButton
          id="platform-listbox"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm rounded-md shadow-sm bg-bg text-font text-left cursor-default relative">
          <div className="flex items-center space-x-2">
            {currentSelectedOption.icon}
            <span className="block truncate">{currentSelectedOption.label}</span>
          </div>
        </ListboxButton>
        <ListboxOptions className="z-10 w-full bg-white shadow-lg max-h-70 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {platformOptions.map(option => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ active }) =>
                `${active ? 'text-white bg-secondary' : 'text-gray-900'}
                cursor-default select-none relative py-2 pl-3 pr-9`
              }>
              {({ selected, active }) => (
                <div className="flex items-center space-x-2">
                  {option.icon}
                  <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>{option.label}</span>
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {mode === 0 && (
        <div className="text-sm text-gray-500 mt-2">
          If dropdown fails click{' '}
          <span className="cursor-pointer text-blue-600 hover:underline" onClick={gotoSettings}>
            here
          </span>
        </div>
      )}
    </div>
  );
};
