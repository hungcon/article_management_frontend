/* eslint-disable import/prefer-default-export */
export const init = {
  INIT_RSS: {
    version: 0,
    url: '',
    configuration: {
      itemSelector: 'item',
      titleSelector: 'title',
      linkSelector: 'link',
      sapoSelector: 'description',
      publishDateSelector: 'pubDate',
    },
  },
  INIT_HTML: {
    contentRedundancySelectors: [],
    url: '',
    blocksConfiguration: [],
  },
  INIT_BLOCK: {
    configuration: {
      redundancySelectors: [],
      itemSelector: '',
      titleSelector: '',
      linkSelector: '',
    },
    blockSelector: '',
  },
  INIT_ARTICLE: {
    sapoSelector: '',
    sapoRedundancySelectors: [],
    titleSelector: '',
    titleRedundancySelectors: [],
    thumbnailSelector: '',
    thumbnailRedundancySelectors: [],
    tagsSelector: '',
    tagsRedundancySelectors: [
    ],
    contentSelector: '',
    contentRedundancySelectors: [],
    textRedundancySelectors: [],
    articleDemoLink: '',
  },
};
