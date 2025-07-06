export const instaConfigs = {
  mainContainer: { selector: '[role="main"]', type: 'attribute', parents: 0 },
  postContainer: { selector: 'article', type: 'attribute', parents: 0 },
  messageContainer: { selector: '[style="display: inline;"]', type: 'attribute', parents: 0 },
  otherContainers: {},
  others: {
    exempt: 'ig-pages-exempt',
    createTimeout: { selector: 'ig-timeout', text: 'Instagram' },
  },
  onOpen: {
    General: {
      url: '_',
      hideElement: {
        'postings-toggle': { selector: '[aria-label="New post"]', type: 'attribute', parents: 8 },
      },
    },
    Navigation: {
      url: '_',
      hideElement: {
        'ig-home-toggle': { selector: '[aria-label="Home"]', type: 'attribute', parents: 8 },
        'ig-video-toggle': { selector: '[aria-label="Reels"]', type: 'attribute', parents: 8 },
        'ig-messages-toggle': { selector: '[aria-label="Direct"]', type: 'attribute', parents: 8 },
        'ig-notification-toggle': { selector: '[aria-label="Notifications"]', type: 'attribute', parents: 8 },
        'ig-explore-toggle': { selector: '[aria-label="Explore"]', type: 'attribute', parents: 8 },
        'ig-search-toggle': { selector: '[aria-label="Search"]', type: 'attribute', parents: 8 },
        'ig-profile-toggle': { selector: 'Profile', type: 'text', parents: 10 },
      },
    },
    Home: {
      url: '/',
      hideElement: {
        'ig-posts-toggle': {
          selector:
            'x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1',
          type: 'class',
          parents: 0,
        },
        'ig-stories-toggle': { selector: '[data-pagelet="story_tray"]', type: 'attribute', parents: 0 },
        'ig-suggestedfriends-toggle': { selector: 'Suggested for you', type: 'text', parents: 3 },
      },
    },
    Pages: {
      url: '/',
      hideElement: {
        'ig-pagesposts-toggle': [
          { selector: 'Posts', type: 'text', parents: 1 },
          { selector: '_ac7v x1f01sob xcghwft xat24cr xzboxd6', type: 'class', parents: 1 },
        ],
        'ig-pagesreels-toggle': { selector: 'Reels', type: 'text', parents: 1 },
        'ig-pagestagged-toggle': { selector: 'Tagged', type: 'text', parents: 1 },
        'ig-pagesstories-toggle': { selector: '[role="menu"]', type: 'attribute', parents: 0 },
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
      'comments-toggle': [
        { selector: 'View all', type: 'text', parents: 2 },
        { selector: '[placeholder="Add a comment…"]', type: 'attribute', parents: 5 },
        { selector: '[aria-label="Comment"]', type: 'attribute', parents: 0 },
      ],
      'reacts-toggle': [
        { selector: 'Liked by', type: 'text', parents: 4 },
        { selector: 'likes', type: 'text', parents: 4 },
        { selector: '[aria-label="Like"]', type: 'attribute', parents: 0 },
      ],
      'shares-toggle': [{ selector: '[aria-label="Share"]', type: 'attribute', parents: 0 }],
      'saves-toggle': [{ selector: '[aria-label="Save"]', type: 'attribute', parents: 0 }],
    },
  },
};
