import type React from 'react';
import { useState } from 'react';
import { Setting, Stats } from '@extension/ui';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

const Credits: React.FC = () => {
  const sources = [
    {
      name: 'Claude Monet',
      piece: 'The Magpie',
      url: 'https://commons.wikimedia.org/wiki/File:Claude_Monet_-_The_Magpie_-_Google_Art_Project.jpg',
      description: 'Used for the dashboard background.',
    },
    {
      name: 'Freepik',
      piece: 'Stock Images',
      url: 'https://www.freepik.com/photos',
      description: 'Image used for chrome web store graphics.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <header className="mb-10">
        <h2 className="text-3xl font-serif font-bold text-font">Credits & Attribution</h2>
        <p className="text-sm text-font mt-2">
          This project is made possible by the following open-source assets and public domain works.
        </p>
      </header>

      <div className="grid gap-6">
        {sources.map((source, index) => (
          <div
            key={index}
            className="group relative p-5 rounded-2xl bg-primary border border-slate-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-font leading-tight">{source.piece}</h3>
                <p className="text-sm italic text-slate-500 mb-2">by {source.name}</p>
                <p className="text-sm leading-relaxed text-font max-w-prose">{source.description}</p>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center self-start px-4 py-2 rounded-full bg-bg text-xs font-semibold text-font hover:bg-blue-500 hover:text-white transition-colors">
                License/Source
                <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Options: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Stats',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
          />
        </svg>
      ),
    },
    {
      name: 'Settings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
    {
      name: 'Credits',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundImage: `url(${chrome.runtime.getURL('optionsbackground.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="h-screen w-screen flex items-center justify-center p-0 md:p-6 ">
      <div className="w-full max-w-6xl h-screen md:h-[85vh] backdrop-blur-xl border-x md:border border-white/10 md:rounded-2xl shadow-2xl flex overflow-hidden relative">
        <TabGroup vertical selectedIndex={selectedIndex} onChange={setSelectedIndex} className="flex w-full">
          <aside
            className={`
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            bg-secondary md:translate-x-0 fixed md:relative z-40 w-64 h-full border-r border-white/2 p-6 transition-transform duration-300 ease-in-out flex flex-col justify-between
          `}>
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl text-font font-bold tracking-tight">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-font/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <TabList className="flex flex-col gap-2">
                {navigation.map(item => (
                  <Tab
                    key={item.name}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ selected }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-font transition-all focus:outline focus:outline-bg duration-200
                      ${selected ? 'bg-primary' : 'hover:bg-primary'}
                    `}>
                    {item.icon} {item.name}
                  </Tab>
                ))}
                <a
                  href={'https://johnsony0.github.io/clarity/faq'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-font transition-all focus:outline focus:outline-bg hover:bg-primary transition-all duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                  <span>Help</span>
                </a>
              </TabList>
            </div>
          </aside>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          <main className="flex-grow flex flex-col min-w-0">
            <header className="h-16 border-b border-white/5 flex items-center p-6 md:px-8 justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 text-font/80 hover:bg-white/5 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
                <h2 className="text-font font-semibold text-lg">{navigation[selectedIndex].name}</h2>
              </div>
            </header>

            <TabPanels className="flex-grow overflow-y-auto p-4 no-scrollbar outline-none">
              <TabPanel className="outline-none focus:outline-none">
                <Stats mode={0} />
              </TabPanel>
              <TabPanel className="outline-none focus:outline-none">
                <Setting mode={0} />
              </TabPanel>
              <TabPanel className="outline-none focus:outline-none">
                <Credits />
              </TabPanel>
            </TabPanels>
          </main>
        </TabGroup>
      </div>
    </div>
  );
};
