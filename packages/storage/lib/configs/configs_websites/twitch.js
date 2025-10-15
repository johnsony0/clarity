import { type } from 'os';

export const twitchConfigs = {
  mainContainer: { selector: '[aria-label="Home timeline"]', type: 'attribute', parents: 0 },
  postContainer: [
    { selector: 'article', type: 'attribute', parents: 0 },
    { selector: '[class="css-175oi2r r-1adg3ll r-1ny4l3l"]', type: 'attribute', parents: 1 },
  ],
  siteContainer: { selector: '[aria-label="Home timeline"]', type: 'attribute', parents: 0 },
  messageContainer: { selector: '[data-testid="tweetText"]', type: 'attribute', parents: 0 },
  otherContainers: {},
  others: {
    exempt: 'tw-pages-exempt',
    createTimeout: { selector: 'tw-timeout', text: 'Twitch' },
  },
  onOpen: {
    General: {
      url: '_',
      hideElement: {
        'postings-toggle': [
          { selector: '[data-testid="toolBar"]', type: 'attribute', parents: 11 },
          { selector: '[aria-label="Post"]', type: 'attribute', parents: 0 },
          { selector: '[aria-label="Post text"]', type: 'attribute', parents: 26 },
        ],
      },
    },
    Navigation: {
      url: '_',
      hideElement: {
        'tw-nav-following-toggle': { selector: '[aria-label="Following"]', type: 'attribute', parents: 0 },
        'tw-nav-sidebarsuggestions-toggle': {
          selector: '[data-test-selector="side-nav"]',
          type: 'attribute',
          parents: 0,
        },
        'tw-nav-browse-toggle': { selector: '[aria-label="Browse"]', type: 'attribute', parents: 0 },
        'tw-nav-more-toggle': { selector: '[aria-label="More Options"]', type: 'attribute', parents: 0 },
        'tw-nav-search-toggle': { selector: '[aria-label="Search"]', type: 'attribute', parents: 0 },
        'tw-nav-news-toggle': { selector: '[aria-label="Prime offers"]', type: 'attribute', parents: 0 },
        'tw-nav-notifications-toggle': { selector: '[aria-label="Open Notifications"]', type: 'attribute', parents: 0 },
        'tw-nav-whispers-toggle': { selector: '[aria-label="Close Threads"]', type: 'attribute', parents: 0 },
        'tw-nav-getbits-toggle': { selector: '[aria-label="Get Bits"]', type: 'attribute', parents: 0 },
        'tw-nav-adfree-toggle': { selector: '[aria-label="Go Ad-Free for Free"]', type: 'attribute', parents: 0 },
        'tw-nav-profile-toggle': { selector: '[alt="User Avatar"]', type: 'attribute', parents: 0 },
      },
      hideElements: {},
    },
    Home: {
      url: '_',
      hideElement: {
        'tw-home-feed-toggle': { selector: '[aria-label="Main Content"]', type: 'attribute', parents: 0 },
        //'tw-home-carousel-toggle': {selector: '[data-a-target="front-page-carousel"]', type: 'attribute', parents: 0}
      },
      deleteElement: {
        'tw-home-carousel-toggle': { selector: '[data-a-target="front-page-carousel"]', type: 'attribute', parents: 0 },
      },
    },
    Pages: {
      url: '_',
      hideElement: {},
    },
    Extras: {
      url: '',
      hideElement: {},
    },
  },
  onPost: {
    hideElements: {},
    hideElement: {},
  },
};
