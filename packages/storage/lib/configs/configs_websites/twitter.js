export const twitterConfigs = {
  mainContainer: { selector: '[aria-label="Home timeline"]', type: 'attribute', parents: 0 },
  postContainer: [{ selector: 'article', type: 'attribute', parents: 0 }],
  messageContainer: { selector: '[data-testid="tweetText"]', type: 'attribute', parents: 0 },
  otherContainers: {},
  others: {
    exempt: 'x-pages-exempt',
    createTimeout: { selector: 'x-timeout', text: 'X/Twitter' },
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
        'x-nav-home-toggle': { selector: '[aria-label="Home"]', type: 'attribute', parents: 0 },
        'x-nav-search-toggle': [
          { selector: '[aria-label="Search and explore"]', type: 'attribute', parents: 0 },
          { selector: '[role="search"]', type: 'attribute', parents: 0 },
        ],
        'x-nav-messages-toggle': { selector: '[aria-label="Direct Messages"]', type: 'attribute', parents: 0 },
        'x-nav-notification-toggle': { selector: '[aria-label="Notifications"]', type: 'attribute', parents: 0 },
        'x-nav-grok-toggle': [
          { selector: '[aria-label="Grok"]', type: 'attribute', parents: 0 },
          {
            selector: 'css-175oi2r r-6koalj r-eqz5dr r-16y2uox r-1pi2tsx r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l',
            type: 'class',
            parents: 2,
          },
        ],
        'x-nav-jobs-toggle': { selector: '[aria-label="Jobs"]', type: 'attribute', parents: 0 },
        'x-nav-communities-toggle': { selector: '[aria-label="Communities"]', type: 'attribute', parents: 0 },
        'x-nav-premium-toggle': [
          { selector: '[data-testid="super-upsell-UpsellCardRenderProperties"]', type: 'attribute', parents: 1 },
          { selector: '[aria-label="Premium"]', type: 'attribute', parents: 0 },
        ],
        'x-nav-business-toggle': { selector: '[aria-label="Business"]', type: 'attribute', parents: 0 },
        'x-nav-profile-toggle': { selector: '[aria-label="Profile"]', type: 'attribute', parents: 0 },
        'x-nav-menu-toggle': { selector: '[aria-label="More menu items"]', type: 'attribute', parents: 0 },
        'x-nav-list-toggle': { selector: '[aria-label="Lists"]', type: 'attribute', parents: 0 },
        'x-nav-bookmark-toggle': { selector: '[aria-label="Bookmarks"]', type: 'attribute', parents: 0 },
        'x-nav-verifiedorgs-toggle': { selector: '[aria-label="Verified Orgs"]', type: 'attribute', parents: 0 },
      },
    },
    Home: {
      url: '/home',
      hideElement: {
        'x-home-posts-toggle': { selector: '[role="region"]', type: 'attribute', parents: 0 },
        'x-home-foryou-toggle': { selector: 'For you', type: 'text', parents: 4 },
        'x-home-following-toggle': { selector: 'Following', type: 'text', parents: 4 },
        'x-home-trending-toggle': { selector: '[aria-label="Timeline: Trending now"]', type: 'attribute', parents: 1 },
        'x-home-recc-toggle': { selector: '[aria-label="Who to follow"]', type: 'attribute', parents: 1 },
        'x-home-news-toggle': { selector: 'Today’s News', type: 'text', parents: 4 },
      },
    },
    Pages: {
      url: '/',
      hideElement: {
        'x-pages-posts-toggle': [
          { selector: '[role="region"]', type: 'attribute', parents: 0 },
          { selector: 'Posts', type: 'text', parents: 4 },
        ],
        'x-pages-articles-toggle': { selector: 'Articles', type: 'text', parents: 4 },
        'x-pages-replies-toggle': { selector: 'Replies', type: 'text', parents: 4 },
        'x-pages-highlights-toggle': { selector: 'Highlights', type: 'text', parents: 4 },
        'x-pages-media-toggle': { selector: 'Media', type: 'text', parents: 4 },
        'x-pages-trending-toggle': { selector: '[aria-label="Timeline: Trending now"]', type: 'attribute', parents: 1 },
        'x-pages-suggestions-toggle': { selector: '[aria-label="Who to follow"]', type: 'attribute', parents: 1 },
        'x-pages-affiliates-toggle': { selector: 'Affiliates', type: 'text', parents: 4 },
      },
    },
    Explore: {
      url: '/explore',
      hideElement: {
        'x-explore-feed-toggle': { selector: '[aria-label="Timeline: Explore"]', type: 'attribute', parents: 0 },
        'x-explore-foryou-toggle': { selector: 'For You', type: 'text', parents: 4 },
        'x-explore-news-toggle': [
          { selector: `Today's News`, type: 'text', parents: 4 },
          { selector: `Today’s News`, type: 'text', parents: 4 },
          { selector: `News`, type: 'text', parents: 4 },
          { selector: '[class="css-175oi2r r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21"]', type: 'attribute', parents: 3 },
        ],
        'x-explore-trending-toggle': { selector: 'Trending', type: 'text', parents: 4 },
        'x-explore-sports-toggle': { selector: 'Sports', type: 'text', parents: 4 },
        'x-explore-entertainment-toggle': { selector: 'Entertainment', type: 'text', parents: 4 },
      },
      hideElements: {
        'x-explore-news-toggle': {
          selector:
            '[class="css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-1udbk01 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1inkyih r-rjixqe r-b88u0q r-15zivkp"]',
          type: 'attribute',
          parents: 3,
        },
        'x-explore-trending-toggle': {
          selector: '[class="css-175oi2r r-6koalj r-1mmae3n r-3pj75a r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21"]',
          type: 'attribute',
          parents: 3,
        },
      },
    },
    Search: {
      url: '/search',
      hideElement: {
        'x-search-feed-toggle': { selector: '[aria-label="Timeline: Search timeline"]', type: 'attribute', parents: 0 },
        'x-search-lists-toggle': { selector: 'Lists', type: 'text', parents: 4 },
        'x-search-top-toggle': { selector: 'Top', type: 'text', parents: 4 },
        'x-search-latest-toggle': { selector: 'Latest', type: 'text', parents: 4 },
        'x-search-people-toggle': { selector: 'People', type: 'text', parents: 4 },
        'x-search-news-toggle': { selector: 'Today’s News', type: 'text', parents: 5 },
        'x-search-filter-toggle': [
          { selector: 'Search filters', type: 'text', parents: 4 },
          {
            selector:
              '[class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q r-iphfwy r-ttdzmv"]',
            type: 'attribute',
            parents: 4,
          },
          { selector: 'Advanced search', type: 'text', parents: 5 },
        ],
      },
    },
    Extras: {
      url: '',
      hideElement: {},
    },
  },
  onPost: {
    hideElements: {},
    hideElement: {
      'x-posts-comments-toggle': { selector: '[data-testid="reply"]', type: 'attribute', parents: 0 },
      'x-posts-reacts-toggle': [{ selector: '[data-testid="like"]', type: 'attribute', parents: 0 }],
      'x-posts-shares-toggle': [
        { selector: '[data-testid="retweet"]', type: 'attribute', parents: 0 },
        { selector: '[aria-label="Share post"]', type: 'attribute', parents: 0 },
      ],
      'x-posts-stats-toggle': [
        { selector: '[aria-label*="View post analytics"]', type: 'attribute', parents: 0 },
        { selector: 'Views', type: 'text', parents: 3 },
      ],
      'x-posts-saves-toggle': [{ selector: '[data-testid="bookmark"]', type: 'attribute', parents: 0 }],
      'x-posts-explain-toggle': { selector: `[aria-label="Grok actions"]`, type: 'attribute', parents: 0 },
    },
  },
};
