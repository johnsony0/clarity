export const youtubeConfigs = {
  mainContainer: { selector: `[id="contents"]`, type: 'attribute', parents: 0 },
  postContainer: [
    { selector: '[id="content"]', type: 'attribute', parents: 0 },
    {
      selector: '[class="ytGridShelfViewModelHost ytd-item-section-renderer ytGridShelfViewModelHostHasBottomButton"]',
      type: 'attribute',
      parents: 0,
    },
  ],
  siteContainer: { selector: '[id="primary"]', type: 'attribute', parents: 0 },
  messageContainer: {
    selector:
      '[class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"]',
    type: 'attribute',
    parents: 0,
  },
  otherContainers: {
    'yt-home-playables-toggle': [{ selector: 'YouTube Playables', type: 'text', parents: 10 }],
    'yt-shorts-toggle': [
      { selector: 'Shorts', type: 'text', parents: 7 },
      { selector: 'Recently uploaded Shorts', type: 'text', parents: 7 },
    ],
    'yt-home-featured-toggle': [{ selector: '[id="chips"]', type: 'attribute', parents: 0 }],
    'yt-home-breakingnews-toggle': [{ selector: 'Breaking news', type: 'text', parents: 9 }],
  },
  others: {
    exempt: 'yt-pages-exempt',
    createTimeout: { selector: 'yt-timeout', text: 'YouTube' },
  },
  onOpen: {
    General: {
      url: '_',
      hideElement: {
        'postings-toggle': { selector: '[aria-label="Create"]', type: 'attribute', parents: 2 },
      },
    },
    Navigation: {
      url: '_',
      hideElement: {
        'yt-nav-search-toggle': [
          { selector: '[role="search"]', type: 'attribute', parents: 0 },
          { selector: '[aria-label="Search with your voice"]', type: 'attribute', parents: 0 },
        ],
        'yt-nav-notification-toggle': { selector: '[aria-label="Notifications"]', type: 'attribute', parents: 2 },
        'yt-nav-home-toggle': [
          { selector: '[aria-label="Home"]', type: 'attribute', parents: 0 },
          { selector: '[title="Home"]', type: 'attribute', parents: 0 },
        ],
        'yt-nav-subscriptions-toggle': [
          { selector: '[href="/feed/subscriptions"]', type: 'attribute', parents: 0 },
          { selector: '[href="/feed/channels"]', type: 'attribute', parents: 1 },
          { selector: '[title="All subscriptions"]', type: 'attribute', parents: 3 },
          { selector: '[title="Show more"]', type: 'attribute', parents: 4 },
          { selector: '[aria-label="Subscriptions"]', type: 'attribute', parents: 0 },
        ],
        'yt-nav-profile-toggle': { selector: '[aria-label="Account menu"]', type: 'attribute', parents: 0 },
        'yt-nav-you-toggle': [
          { selector: '[aria-label="You"]', type: 'attribute', parents: 0 },
          { selector: '[href="/feed/you"]', type: 'attribute', parents: 3 },
          { selector: '[aria-label="Downloads"]', type: 'attribute', parents: 0 },
        ],
        'yt-nav-explore-toggle': { selector: 'Explore', type: 'text', parents: 2 },
        'yt-nav-morefrom-toggle': { selector: 'More from YouTube', type: 'text', parents: 2 },
      },
      hideElements: {
        'yt-nav-subscriptions-toggle': [{ selector: '[title="Subscriptions"]', type: 'attribute', parents: 1 }],
        'yt-shorts-toggle': [
          { selector: '[aria-label="Shorts"]', type: 'attribute', parents: 0 },
          { selector: '[title="Shorts"]', type: 'attribute', parents: 0 },
        ],
      },
    },
    Home: {
      url: '/',
      hideElement: {
        'yt-home-posts-toggle': { selector: 'contents', type: 'id', parents: 0 },
      },
      hideElements: {
        'yt-home-genres-toggle': { selector: '[id="chips"]', type: 'attribute', parents: 0 },
      },
    },
    Pages: {
      url: '/@',
      hideElement: {
        'yt-pages-feed-toggle': { selector: '[id="contents"]', type: 'attribute', parents: 0 },
        'yt-pages-home-toggle': { selector: '[tab-title="Home"]', type: 'attribute', parents: 0 },
        'yt-pages-videos-toggle': { selector: '[tab-title="Videos"]', type: 'attribute', parents: 0 },
        'yt-shorts-toggle': { selector: '[tab-title="Shorts"]', type: 'attribute', parents: 0 },
        'yt-pages-live-toggle': { selector: '[tab-title="Live"]', type: 'attribute', parents: 0 },
        'yt-pages-podcasts-toggle': { selector: '[tab-title="Podcasts"]', type: ' attribute', parents: 0 },
        'yt-pages-playlists-toggle': { selector: '[tab-title="Playlists"]', type: 'attribute', parents: 0 },
        'yt-pages-posts-toggle': { selector: '[tab-title="Posts"]', type: 'attribute', parents: 0 },
        'yt-pages-store-toggle': { selector: '[tab-title="Store"]', type: 'attribute', parents: 0 },
        'yt-nav-search-toggle': {
          selector: '[class="yt-tab-shape-wiz yt-tab-shape-wiz__tab--last-tab"]',
          type: ' attribute',
          parents: 0,
        },
      },
    },
    Search: {
      url: '/results',
      hideElement: {
        'yt-search-feed-toggle': { selector: 'primary', type: 'id', parents: 0 },
        'yt-search-filter-toggle': { selector: '[aria-label="Search filters"]', type: 'attribute', parents: 0 },
      },
      deleteElement: {
        'yt-search-secondary-toggle': { selector: 'secondary', type: 'id', parents: 0 },
      },
    },
    Extras: {
      url: '/watch',
      hideElement: {
        'yt-posts-comments-toggle': [
          { selector: 'comments', type: 'id', parents: 0 },
          { selector: 'chat-messages', type: 'id', parents: 0 },
        ],
        'yt-posts-description-toggle': { selector: 'description-inner', type: 'id', parents: 1 },
        'yt-posts-summary-toggle': { selector: 'expandable-metadata', type: 'id', parents: 0 },
        'yt-posts-suggestions-toggle': { selector: 'player-ads', type: 'id', parents: 1 },
        'yt-posts-mixes-toggle': {
          selector: '[title="Mixes are playlists YouTube makes for you"]',
          type: 'attribute',
          parents: 8,
        },
        'yt-posts-livechat-toggle': { selector: 'chatframe', type: 'id', parents: 2 },
      },
      hideElements: {
        'yt-posts-livechat-toggle': [{ selector: 'teaser-carousel', type: 'id', parents: 0 }],
        'yt-posts-askai-toggle': {
          selector: '[aria-label="Ask"]',
          type: 'attribute',
          parents: 0,
        },
        'yt-posts-download-toggle': { selector: '[aria-label="Download"]', type: 'attribute', parents: 0 },
        'yt-posts-clip-toggle': { selector: '[aria-label="Clip"]', type: 'attribute', parents: 0 },
        'yt-posts-reacts-toggle': [
          {
            selector: '[class="ytSegmentedLikeDislikeButtonViewModelHost style-scope ytd-menu-renderer"]',
            type: 'attribute',
            parents: 0,
          },
        ],
        'yt-posts-shares-toggle': {
          selector: '[aria-label="Share"]',
          type: 'attribute',
          parents: 0,
        },
        'yt-posts-saves-toggle': [{ selector: '[aria-label="Save to playlist"]', type: 'attribute', parents: 0 }],
      },
      deleteElements: {
        'yt-posts-livechat-toggle': { selector: '[id=panels-full-bleed-container]', type: 'attribute', parents: 0 },
      },
    },
  },
  onPost: {
    hideElements: {},
    hideElement: {},
  },
};
