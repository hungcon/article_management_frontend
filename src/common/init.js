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
      itemSelector: 'li',
      titleSelector: 'a.mrk-click',
      linkSelector: 'a.mrk-click',
    },
    blockSelector: '.list-news',
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
  INIT_SCHEDULES: {
    scheduleDefault: [
      {
        key: 'Every 5 minutes',
        value: '0 */5 * * * *',
      },
      {
        key: 'Every 10 minutes',
        value: '0 */10 * * * *',
      },
      {
        key: 'Every 15 minutes',
        value: '0 */15 * * * *',
      },
      {
        key: 'Every 30 minutes',
        value: '0 */30 * * * *',
      },
      {
        key: 'Every 1 hour',
        value: '0 * * * * *',
      },
    ],
  },
  INIT_WORD_INFO: {
    sentenceId: '',
    allophones: '',
    position: 0,
    type: '',
    orig: '',
    machineNormalize: '',
    peopleNormalize: '',
  },

  INIT_WORD_SELECT: {
    loanwordsSelect: [],
    abbreviationsSelect: [],
  },
};
