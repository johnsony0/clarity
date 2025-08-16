export const youtubeConfigs = {
  mainContainer: { selector: 'contents', type: 'id', parents: 0 },
  postContainer: { selector: '[class="style-scope ytd-rich-grid-renderer"]', type: 'attribute', parents: 0 },
  messageContainer: { selector: 'dnc', type: 'attribute', parents: 0 },
  otherContainers: {
    'yt-playables-toggle': [{ selector: 'YouTube Playables', type: 'text', parents: 10 }],
    'yt-shorts-toggle': [{ selector: 'Shorts', type: 'text', parents: 8 }],
    'yt-featured-toggle': [{ selector: '[id="chips"]', type: 'attribute', parents: 0 }],
    'yt-breakingnews-toggle': [{ selector: 'Breaking news', type: 'text', parents: 9 }],
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
        'yt-search-toggle': [
          { selector: '[role="search"]', type: 'attribute', parents: 0 },
          { selector: '[aria-label="Search with your voice"]', type: 'attribute', parents: 0 },
        ],
        'yt-notification-toggle': { selector: '[aria-label="Notifications"]', type: 'attribute', parents: 2 },
        'yt-home-toggle': [
          { selector: '[aria-label="Home"]', type: 'attribute', parents: 0 },
          { selector: '[title="Home"]', type: 'attribute', parents: 0 },
        ],
        'yt-shorts-toggle': [
          { selector: '[aria-label="Shorts"]', type: 'attribute', parents: 0 },
          { selector: '[title="Shorts"]', type: 'attribute', parents: 0 },
        ],
        'yt-subscriptions-toggle': [
          { selector: '[aria-label="Subscriptions"]', type: 'attribute', parents: 0 },
          { selector: '[title="Subscriptions"]', type: 'attribute', parents: 1 },
          { selector: '[title="All subscriptions"]', type: 'attribute', parents: 3 },
          { selector: '[title="Show more"]', type: 'attribute', parents: 4 },
        ],
        'yt-profile-toggle': [
          { selector: '[aria-label="You"]', type: 'attribute', parents: 0 },
          { selector: '[title="You"]', type: 'attribute', parents: 3 },
        ],
        'yt-explore-toggle': { selector: 'Explore', type: 'text', parents: 2 },
        'yt-morefrom-toggle': { selector: 'More from YouTube', type: 'text', parents: 2 },
      },
    },
    Home: {
      url: '/',
      hideElement: {
        'yt-homeposts-toggle': { selector: 'contents', type: 'id', parents: 0 },
        'yt-genres-toggle': { selector: '[id="chips"]', type: 'attribute', parents: 0 },
      },
    },
    Pages: {
      url: '/@',
      hideElement: {
        'yt-pagesposts-toggle': [
          { selector: '[tab-title="Home"]', type: 'attribute', parents: 0 },
          { selector: '[id="contents"]', type: 'attribute', parents: 0 },
        ],
        'yt-videos-toggle': { selector: '[tab-title="Videos"]', type: 'attribute', parents: 0 },
        'yt-shorts-toggle': { selector: '[tab-title="Shorts"]', type: 'attribute', parents: 0 },
        'yt-live-toggle': { selector: '[tab-title="Live"]', type: 'attribute', parents: 0 },
        'yt-podcasts-toggle': { selector: '[tab-title="Podcasts"]', type: ' attribute', parents: 0 },
        'yt-playlists-toggle': { selector: '[tab-title="Playlists"]', type: 'attribute', parents: 0 },
        'yt-posts-toggle': { selector: '[tab-title="Posts"]', type: 'attribute', parents: 0 },
        'yt-store-toggle': { selector: '[tab-title="Store"]', type: 'attribute', parents: 0 },
        'yt-search-toggle': {
          selector: '[class="yt-tab-shape-wiz yt-tab-shape-wiz__tab--last-tab"]',
          type: ' attribute',
          parents: 0,
        },
      },
    },
    Extras: {
      url: '/watch',
      hideElement: {
        'yt-comments-toggle': [
          { selector: 'comments', type: 'id', parents: 0 },
          { selector: 'chat-messages', type: 'id', parents: 0 },
        ],
        'yt-livechat-toggle': [
          { selector: 'chatframe', type: 'id', parents: 2 },
          { selector: 'teaser-carousel', type: 'id', parents: 0 },
        ],
        'yt-reacts-toggle': [
          {
            selector: '[class="ytSegmentedLikeDislikeButtonViewModelHost style-scope ytd-menu-renderer"]',
            type: 'attribute',
            parents: 0,
          },
        ],
        'yt-shares-toggle': {
          selector: '[class="yt-spec-button-view-model style-scope ytd-menu-renderer"]',
          type: 'attribute',
          parents: 0,
        },
        'yt-saves-toggle': [{ selector: '[aria-label="Save to playlist"]', type: 'attribute', parents: 0 }],
        'yt-description-toggle': { selector: 'description-inner', type: 'id', parents: 1 },
        'yt-download-toggle': { selector: '[aria-label="Download"]', type: 'attribute', parents: 0 },
        'yt-clip-toggle': { selector: 'Clip', type: 'text', parents: 3 },
        'yt-suggestions-toggle': { selector: 'player-ads', type: 'id', parents: 1 },
        'yt-mixes-toggle': {
          selector: '[title="Mixes are playlists YouTube makes for you"]',
          type: 'attribute',
          parents: 8,
        },
      },
    },
  },
  onPost: {
    hideElements: {},
    hideElement: {},
  },
};
