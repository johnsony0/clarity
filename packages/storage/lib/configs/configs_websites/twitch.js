export const twitchConfigs = {
  mainContainer: { selector: '[aria-label="Main Content"]', type: 'attribute', parents: 0 },
  postContainer: [{ selector: '[data-test-selector="shelf-card-selector"]', type: 'attribute', parents: 0 }],
  siteContainer: { selector: '[id="root"]', type: 'attribute', parents: 0 },
  messageContainer: { selector: '[class="CoreText-sc-1txzju1-0 kdDAY"]', type: 'attribute', parents: 0 },
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
        'tw-nav-news-toggle': { selector: '[aria-label="Prime offers"]', type: 'attribute', parents: 6 },
        'tw-nav-notifications-toggle': { selector: '[aria-label="Open Notifications"]', type: 'attribute', parents: 6 },
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
        'tw-home-carousel-toggle': { selector: '[data-a-target="front-page-carousel"]', type: 'attribute', parents: 0 },
      },
      deleteElement: {
        'tw-home-carousel-toggle': { selector: '[data-a-target="front-page-carousel"]', type: 'attribute', parents: 0 },
      },
    },
    Pages: {
      url: '/',
      hideElement: {
        'tw-pages-feed-toggle': { selector: '[class="Layout-sc-1xcs6mc-0 hoTBFA"]', type: 'attribute', parents: 0 },
        'tw-pages-live-toggle': { selector: '[class="home"]', type: 'attribute', parents: 2 },
        'tw-pages-home-toggle': { selector: '[tabname="home"]', type: 'attribute', parents: 0 },
        'tw-pages-about-toggle': { selector: '[tabname="about"]', type: 'attribute', parents: 0 },
        'tw-pages-schedule-toggle': { selector: '[tabname="schedule"]', type: 'attribute', parents: 0 },
        'tw-pages-videos-toggle': { selector: '[tabname="videos"]', type: 'attribute', parents: 0 },
        'tw-pages-chat-toggle': { selector: '[tabname="chat"]', type: 'attribute', parents: 0 },
        'tw-pages-sub-toggle': [
          { selector: '[aria-label="Gift a Sub"]', type: 'attribute', parents: 0 },
          { selector: '[aria-label="Subscribe"]', type: 'attribute', parents: 0 },
        ],
      },
    },
    Search: {
      url: '/directory',
      hideElement: {
        'tw-search-feed-toggle': {
          selector: '[class="ScTower-sc-1sjzzes-0 eAVcwK tw-tower"]',
          type: 'attribute',
          parents: 1,
        },
        'tw-search-genre-toggle': {
          selector: '[class="Layout-sc-1xcs6mc-0 goosYB vertical-selector__wrapper"]',
          type: 'attribute',
          parents: 1,
        },
        'tw-search-filters-toggle': { selector: '[aria-label="Filter & Sort Options"]', type: 'attribute', parents: 0 },
      },
      deleteElement: {
        'tw-search-filters-toggle': { selector: '[role="tablist"]', type: 'attribute', parents: 0 },
      },
    },
    Extras: {
      url: '',
      hideElement: {
        'tw-posts-livechat-toggle': [
          { selector: '[aria-label="Stream Chat"]', type: 'attribute', parents: 0 },
          { selector: '[aria-label="Expand Chat"]', type: 'attribute', parents: 0 },
          { selector: '[aria-label="Collapse Chat"]', type: 'attribute', parents: 0 },
        ],
        'tw-posts-description-toggle': { selector: '[aria-label="About Panel"]', type: 'attribute', parents: 0 },
        'tw-posts-panels-toggle': {
          selector: '[data-test-selector="masonry_container_selector"]',
          type: 'attribute',
          parents: 0,
        },
        'tw-posts-commenting-toggle': { selector: '[aria-label="Send a message"]', type: 'attribute', parents: 12 },
        'tw-posts-tags-toggle': { selector: '[aria-label="Tags"]', type: 'attribute', parents: 0 },
        'tw-posts-share-toggle': { selector: '[aria-label="Share"]', type: 'attribute', parents: 0 },
      },
    },
  },
  onPost: {
    hideElements: {},
    hideElement: {},
  },
};
