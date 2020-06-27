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
      publicDateSelector: 'pubDate',
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
    contentSelector: '',
    contentRedundancySelectors: [],
    textRedundancySelectors: [],
    articleDemoLink: '',
  },
  INIT_SCHEDULES: {
    scheduleDefault: [
      {
        key: 'Mỗi 5 phút',
        value: '0 */5 * * * *',
      },
      {
        key: 'Mỗi 10 phút',
        value: '0 */10 * * * *',
      },
      {
        key: 'Mỗi 15 phút',
        value: '0 */15 * * * *',
      },
      {
        key: 'Mỗi 30 phút',
        value: '0 */30 * * * *',
      },
      {
        key: 'Mỗi 1 giờ',
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
