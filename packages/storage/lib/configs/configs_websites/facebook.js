export const facebookConfigs = {
  mainContainer: { selector: '[role="main"]', type: 'attribute', parents: 0 },
  postContainer: [
    {
      selector:
        '[class="x1n2onr6 x1ja2u2z x1jx94hy xw5cjc7 x1dmpuos x1vsv7so xau1kf4 x9f619 xh8yej3 x6ikm8r x10wlt62 xquyuld"]',
      type: 'attribute',
      parents: 0,
    },
  ],
  siteContainer: { selector: '[role="main"]', type: 'attribute', parents: 0 },
  messageContainer: { selector: '[data-ad-preview="message"]', type: 'attribute', parents: 0 },
  otherContainers: {
    'fb-reels-toggle': [
      { selector: 'Reels', type: 'text', parents: 9 },
      { selector: '[aria-label="Open reel in Reels Viewer"]', type: 'attribute', parents: 3 },
    ],
    'fb-home-suggestions-toggle': [
      { selector: '[aria-label="See more groups"]', type: 'attribute', parents: 3 },
      { selector: 'People you may know', type: 'text', parents: 8 },
    ],
  },
  others: {
    exempt: 'fb-pages-exempt',
    createTimeout: { selector: 'fb-timeout', text: 'Facebook' },
  },
  onOpen: {
    General: {
      url: '_',
      hideElement: {
        'fb-messengeroverlay-toggle': {
          selector:
            'x1i10hfl xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1l31dnx x1c9tyrk xeusxvb x1pahc9y x1ertn4p x1qeybcx x3nfvp2 xsdox4t xl56j7k x1n2onr6 x1useyqa x19xcq9t',
          type: 'class',
          parents: 5,
        },
        'fb-stories-toggle': { selector: '[aria-label="Stories"]', type: 'attribute', parents: 0 },
        'postings-toggle': [
          { selector: '[aria-label="Create a post"]', type: 'attribute', parents: 1 },
          { selector: 'Write something...', type: 'text', parents: 4 },
        ],
      },
    },
    Navigation: {
      url: '_',
      hideElement: {
        'fb-nav-search-toggle': { selector: '[aria-label="Search Facebook"]', type: 'attribute', parents: 1 },
        'fb-nav-profile-toggle': {
          selector: `x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1fmog5m xu25z0z x140muxe xo1y3bh x1q0g3np x87ps6o x1lku1pv x1a2a7pz xzsf02u x1rg5ohu`,
          type: 'class',
          parents: 0,
        },
        'fb-nav-home-toggle': { selector: '[aria-label="Home"]', type: 'attribute', parents: 3 },
        'fb-nav-video-toggle': { selector: '[aria-label="Video"]', type: 'attribute', parents: 3 },
        'fb-nav-market-toggle': { selector: '[aria-label="Marketplace"]', type: 'attribute', parents: 3 },
        'fb-nav-groups-toggle': { selector: '[aria-label="Groups"]', type: 'attribute', parents: 3 },
        'fb-nav-gaming-toggle': { selector: '[aria-label="Gaming"]', type: 'attribute', parents: 3 },
        'fb-nav-menu-toggle': { selector: '[aria-label="Menu"]', type: 'attribute', parents: 3 },
        'fb-nav-messages-toggle': {
          selector: '[aria-label="Messenger"]',
          type: 'attribute',
          parents: 3,
        },
        'fb-nav-notification-toggle': { selector: 'Number of unread notifications', type: 'text', parents: 4 },
        'fb-reels-toggle': { selector: '[aria-label="Reels"]', type: 'attribute', parents: 3 },
      },
    },
    Home: {
      url: '/',
      hideElement: {
        'fb-home-posts-toggle': { selector: 'News Feed posts', type: 'text', parents: 1 },
        'fb-home-shortcuts-toggle': {
          selector: 'x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xedcshv x1t2pt76',
          type: 'class',
          parents: 0,
        },
        'fb-home-contacts-toggle': { selector: 'Contacts', type: 'text', parents: 11 },
        'fb-home-groupchats-toggle': { selector: 'Group chats', type: 'text', parents: 8 },
      },
    },
    Pages: {
      url: '/',
      hideElements: {
        'fb-pages-shortcuts-toggle': { selector: '[role="tablist"]', type: 'attribute', parents: 0 },
      },
      hideElement: {
        'fb-pages-posts-toggle': {
          selector:
            'x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv',
          type: 'class',
          parents: 0,
        },
        'fb-pages-intro-toggle': { selector: 'Intro', type: 'text', parents: 11 },
        'fb-pages-photos-toggle': { selector: 'See all photos', type: 'text', parents: 16 },
      },
    },
    Search: {
      url: '/search',
      hideElement: {
        'fb-search-posts-toggle': { selector: '[aria-label="Search results"]', type: 'attribute', parents: 0 },
        'fb-search-filter-toggle': { selector: '[aria-label="Result filters"]', type: 'attribute', parents: 0 },
      },
    },
    Extras: {
      url: '/groups',
      hideElement: {
        'fb-groups-posts-toggle': { selector: '[role="feed"]', type: 'attribute', parents: 0 },
        'fb-groups-shortcuts-toggle': { selector: '[role="tablist"]', type: 'attribute', parents: 0 },
        'fb-groups-about-toggle': { selector: 'About', type: 'text', parents: 11 },
        'fb-groups-recentmedia-toggle': { selector: 'Recent media', type: 'text', parents: 11 },
        'fb-groups-featured-toggle': {
          selector:
            'x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 x1s688f xzsf02u x1yc453h',
          type: 'class',
          parents: 9,
        },
        'fb-groups-recc-toggle': { selector: '[aria-label="See recommended groups"]', type: 'attribute', parents: 2 },
        'fb-groups-search-toggle': { selector: '[aria-label="Search"]', type: 'attribute', parents: 1 },
      },
    },
  },
  onPost: {
    hideElements: {
      'fb-posts-reacts-toggle': [
        { selector: '[aria-label="See who reacted to this"]', type: 'attribute', parents: 1 },
        { selector: '[aria-label="Like"]', type: 'attribute', parents: 0 },
      ],
      'fb-posts-shares-toggle': [
        { selector: `[aria-label="Send this to friends or post it on your profile."]`, type: 'attribute', parents: 0 },
        {
          selector:
            "[class='x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib x1qjc9v5 xozqiw3 x1q0g3np x1ws5yxj xw01apr x4cne27 xifccgj x123j3cw xs9asl8']",
          type: 'attribute',
          parents: 0,
        },
      ],
      'fb-posts-comments-toggle': [
        { selector: `[role="article"]`, type: 'attribute', parents: 0 },
        {
          selector: `[class="x1i10hfl xjbqb8w xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x3ct3a4 xdj266r x14z9mp xat24cr x2lwn1j xeuugli xexx8yu x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1fmog5m xu25z0z x140muxe xo1y3bh x3nfvp2 x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xi81zsa x1q0g3np x1iyjqo2 xs83m0k x1icxu4v xdzw4kq"]`,
          type: 'attribute',
          parents: 3,
        },
        {
          selector: `[class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1q0q8m5 xlxy82 xfo3rzh x1n2bmbs x7pr0uv xfm49vd x1pv694p x1t7ytsu xyumdvf x10l6tqk x1pe450p xvy4d1p x1qx5ct2"]`,
          type: 'attribute',
          parents: 0,
        },
        { selector: `[aria-label="Leave a comment"]`, type: 'attribute', parents: 0 },
      ],
    },
    hideElement: {
      'fb-posts-comments-toggle': [
        { selector: `[aria-label="Write a comment…"]`, type: 'attribute', parents: 12 },
        { selector: `[aria-label="Write an answer…"]`, type: 'attribute', parents: 12 },
        { selector: `[aria-label="Submit your first comment…"]`, type: 'attribute', parents: 12 },
        { selector: 'View more comments', type: 'text', parents: 4 },
        { selector: 'View more answers', type: 'text', parents: 4 },
        {
          selector: '[class="x6s0dn4 x78zum5 xdj266r x14z9mp xat24cr x1lziwak xe0p6wg"]',
          type: 'attribute',
          parents: 2,
        },
      ],
      'fb-posts-shares-toggle': [
        {
          selector:
            'x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x3nfvp2 x1q0g3np x87ps6o x1lku1pv x1a2a7pz',
          type: 'class',
          parents: 0,
        },
        { selector: `Send`, type: 'text', parents: 5 },
        {
          selector: `[style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v4/yH/r/Eoi2rFThRn5.png');background-position:0 -21px;background-size:auto;width:20px;height:20px;background-repeat:no-repeat;display:inline-block"]`,
          type: 'attribute',
          parents: 3,
        },
      ],
    },
  },
};
