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
      hideElement: {},
    },
    Home: {
      url: '_',
      hideElement: {},
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
