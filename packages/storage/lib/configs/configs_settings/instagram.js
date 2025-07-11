export const instagramSettings = {
  General: [
    {
      id: 'ig-timeout',
      label: 'Instagram Timeout (seconds)',
      type: 'number',
      default: 0,
      min: 0,
      max: 300,
      rating: 4,
    },
    { id: 'ig-pages-exempt', label: 'Pages Exempt', type: 'array', default: [] },
  ],
  Navigation: [
    { id: 'ig-home-toggle', label: 'Hide Home Button', type: 'checkbox', default: true, rating: 2 },
    { id: 'ig-search-toggle', label: 'Hide Searchbar', type: 'checkbox', default: true, rating: 2, tag: 'search' },
    { id: 'ig-explore-toggle', label: 'Hide Explore Button', type: 'checkbox', default: true, rating: 2 },
    { id: 'ig-video-toggle', label: 'Hide Reels Button', type: 'checkbox', default: true, rating: 2 },
    {
      id: 'ig-messages-toggle',
      label: 'Hide Messages Button',
      type: 'checkbox',
      default: true,
      rating: 2,
      tag: 'messages',
    },
    { id: 'ig-notification-toggle', label: 'Hide Notification Button', type: 'checkbox', default: true, rating: 2 },
    { id: 'ig-profile-toggle', label: 'Hide Profile Button', type: 'checkbox', default: true, rating: 2 },
  ],
  Posts: [
    { id: 'ig-reacts-toggle', label: 'Hide Reacts', type: 'checkbox', default: true, rating: 3 },
    { id: 'ig-comments-toggle', label: 'Hide Comments', type: 'checkbox', default: true, rating: 3 },
    { id: 'ig-shares-toggle', label: 'Hide Shares', type: 'checkbox', default: true, rating: 3 },
    { id: 'ig-saves-toggle', label: 'Hide Save', type: 'checkbox', default: true, rating: 3 },
  ],
  Home: [
    { id: 'ig-posts-toggle', label: 'Hide Posts', type: 'checkbox', default: false, rating: 5 },
    { id: 'ig-suggestedposts-toggle', label: 'Hide Suggested Posts', type: 'checkbox', default: true, rating: 4 },
    { id: 'ig-stories-toggle', label: 'Hide Stories', type: 'checkbox', default: true, rating: 3 },
    { id: 'ig-suggestedfriends-toggle', label: 'Hide Suggested Friends', type: 'checkbox', default: true, rating: 3 },
  ],
  Pages: [
    { id: 'ig-pagesposts-toggle', label: 'Hide Posts', type: 'checkbox', default: false, rating: 5 },
    { id: 'ig-pagesstories-toggle', label: 'Hide Stories', type: 'checkbox', default: true, rating: 3 },
    { id: 'ig-pagesreels-toggle', label: 'Hide Reels', type: 'checkbox', default: true, rating: 3 },
    { id: 'ig-pagestagged-toggle', label: 'Hide Tagged', type: 'checkbox', default: true, rating: 3 },
  ],
};
