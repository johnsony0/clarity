import type React from 'react';
import { useState, useEffect } from 'react';
import { Setting } from '@extension/ui';
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Switch } from '@headlessui/react';

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
    chrome.storage.local.get(['post_count'], result => {
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
  const [powerState, setPowerState] = useState(true);

  //initial load of power state
  useEffect(() => {
    chrome.storage.sync.get(['power'], result => {
      setPowerState(result.power ?? true); //if unknown we can set to true
    });
  }, []);

  return (
    <div className="flex flex-col max-h-screen">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="sticky top-0 z-10 flex items-center justify-center gap-2 bg-bg p-2">
          <TabList className="flex">
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

            <a
              href={'https://johnsony0.github.io/clarity'}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-3 py-1 text-sm/6 font-semibold text-font focus:outline focus:outline-secondary hover:bg-primary transition-all duration-200">
              <span className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                <span>Help</span>
              </span>
            </a>
          </TabList>
        </div>

        <TabPanels className="flex-grow overflow-y-auto">
          <TabPanel key="stats">
            <PopupStats />
          </TabPanel>
          <TabPanel key="settings">
            <Setting mode={1} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
