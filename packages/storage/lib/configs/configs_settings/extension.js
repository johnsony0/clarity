export const extensionSettings = {
  //{ id: 'theme-toggle', label: 'Dark Mode', type: 'checkbox', default: false, tag: 'light mode' },
  General: [
    {
      id: 'ex-timeout',
      label: 'Setting Timeout (seconds)',
      type: 'number',
      default: 0,
      min: 0,
      max: 300,
      rating: 4,
    },
    { id: 'scroll-limit', label: 'Limit Scrolling', type: 'checkbox', default: true, rating: 3 },
    { id: 'grayscale-toggle', label: 'Grayscale', type: 'checkbox', default: false, rating: 4 },
    { id: 'navs-toggle', label: 'Disable Navigation', type: 'checkbox', default: false, rating: 4 },
    { id: 'imagevideo-toggle', label: 'Hide Images/Videos', type: 'checkbox', default: false, rating: 5 },
  ],
  Sites: [
    { id: 'facebook-toggle', label: 'Enable Facebook', type: 'checkbox', default: true, rating: 1 },
    //{ id: 'instagram-toggle', label: 'Enable Instagram', type: 'checkbox', default: true, rating: 1 },
    { id: 'twitter-toggle', label: 'Enable Twitter', type: 'checkbox', default: true, rating: 1 },
    { id: 'youtube-toggle', label: 'Enable Youtube', type: 'checkbox', default: true, rating: 1 },
  ],
  Posts: [
    { id: 'limit-toggle', label: 'Limit Posts', type: 'checkbox', default: true, rating: 2 },
    { id: 'limit-value', label: 'Limit Posts Amount', type: 'number', default: 600, min: 0, max: 1000, rating: 1 },
    { id: 'postings-toggle', label: 'Hide Post Creation Menu', type: 'checkbox', default: true, rating: 3 },
    { id: 'reacts-toggle', label: 'Hide Reacts', type: 'checkbox', default: true, rating: 3 },
    { id: 'comments-toggle', label: 'Hide Comments', type: 'checkbox', default: true, rating: 3 },
    { id: 'shares-toggle', label: 'Hide Shares', type: 'checkbox', default: true, rating: 3 },
    { id: 'saves-toggle', label: 'Hide Save', type: 'checkbox', default: true, rating: 3 },
  ],
  Content: [
    {
      id: 'content-filter-visibility',
      label: 'Content Filter Visibility',
      type: 'select',
      default: 'min',
      options: [
        { value: 'min', text: 'Minimize' },
        { value: 'hide', text: 'Hide' },
      ],
    },
    { id: 'filtered-words', label: 'Word/Phrase Filter', type: 'array', default: [], placeholder: 'e.g. Breaking Bad' },
  ],
  Bias: [
    { id: 'enable-bias', label: 'Enable Bias Classification', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    {
      id: 'bias-filter-visibility',
      label: 'Bias Filter Visibility',
      type: 'select',
      default: 'min',
      tag: 'bias',
      options: [
        { value: 'min', text: 'Minimize' },
        { value: 'hide', text: 'Hide' },
      ],
    },
    { id: 'bias-threshold', label: 'Threshold', type: 'number', default: 50, min: 5, max: 95 },
  ],
  Topic: [
    {
      id: 'enable-topic',
      label: 'Enable Topic Classification',
      type: 'checkbox',
      default: false,
      tag: 'topic', //rename to ai once fixed
      rating: 5,
    },
    {
      id: 'topic-filter-visibility',
      label: 'Topic Filter Visibility',
      type: 'select',
      default: 'min',
      tag: 'bias',
      options: [
        { value: 'min', text: 'Minimize' },
        { value: 'hide', text: 'Hide' },
      ],
    },
    { id: 'enable-tech', label: 'Hide Tech', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    { id: 'enable-sports', label: 'Hide Sports', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    { id: 'enable-politics', label: 'Hide Politics', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    { id: 'enable-gaming', label: 'Hide Gaming', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    { id: 'enable-food', label: 'Hide Food', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    { id: 'enable-business', label: 'Hide Business', type: 'checkbox', default: true, tag: 'ai', rating: 1 },
    { id: 'topic-threshold', label: 'Hide Threshold', type: 'number', default: 50, min: 5, max: 95 },
  ],
};
