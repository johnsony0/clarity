import type React from 'react';
import { Select } from '@headlessui/react';

interface PlatformSelectorProps {
  onPlatformChange: (platform: string) => void;
  mode: number;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onPlatformChange, mode }) => {
  const gotoSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <div className={`${mode ? 'mb-8' : 'mb-1'}`}>
      <label htmlFor="platform" className="block text-lg font-bold">
        Select Platform
      </label>
      <Select
        id="platform"
        onChange={e => onPlatformChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm rounded-md shadow-sm bg-bg text-font">
        <option value="quick-settings">Quick Settings</option>
        <option value="extension">Shared</option>
        <option value="facebook">Facebook</option>
        {/*<option value="instagram">Instagram</option>*/}
        <option value="twitter">Twitter</option>
        <option value="youtube">Youtube</option>
      </Select>
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
