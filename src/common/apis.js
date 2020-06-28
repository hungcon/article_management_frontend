/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/prefer-default-export
require('dotenv').config();

const { REACT_APP_API_HOST, REACT_APP_API_PORT } = process.env;
const API_HEAD = `http://${REACT_APP_API_HOST}:${REACT_APP_API_PORT}`;
export const API_ENDPOINT = {
  SIGN_IN: `${API_HEAD}/sign-in`,

  // get
  GET_CONFIGURATION: `${API_HEAD}/get-configuration`,
  GET_WEBSITES: `${API_HEAD}/get-websites`,
  GET_CATEGORIES: `${API_HEAD}/get-categories`,
  GET_ACCOUNT: `${API_HEAD}/get-account`,
  GET_USER_INFO: `${API_HEAD}/get-user-info`,
  GET_LIST_ACCOUNTS: `${API_HEAD}/get-list-accounts`,
  GET_VALID_ARTICLES: `${API_HEAD}/get-valid-articles`,
  GET_INVALID_ARTICLES: `${API_HEAD}/get-invalid-articles`,
  GET_CONFIG_BY_WEBSITE: `${API_HEAD}/get-config-by-website`,
  GET_ARTICLE_CONFIG: `${API_HEAD}/get-article-config`,
  GET_VALID_ARTICLE_BY_ID: `${API_HEAD}/get-valid-article-by-id`,
  GET_QUEUE_LENGTH: `${API_HEAD}/get-queue-length`,

  // add
  ADD_ACCOUNT: `${API_HEAD}/add-account`,
  ADD_WEBSITE: `${API_HEAD}/add-website`,
  ADD_CATEGORY: `${API_HEAD}/add-category`,
  ADD_VALID_ARTICLE: `${API_HEAD}/add-valid-articles`,
  ADD_CONFIG: `${API_HEAD}/add-config`,
  ADD_HTML_CONFIG: `${API_HEAD}/add-html-config`,
  ADD_RSS_CONFIG: `${API_HEAD}/add-rss-config`,
  ADD_BLOCK_CONFIG: `${API_HEAD}/add-block-config`,

  // update
  UPDATE_ACCOUNT: `${API_HEAD}/update-account`,
  UPDATE_WEBSITE: `${API_HEAD}/update-website`,
  UPDATE_CATEGORY: `${API_HEAD}/update-category`,
  UPDATE_PASSWORD: `${API_HEAD}/update-password`,
  UPDATE_CONFIG: `${API_HEAD}/update-config`,
  UPDATE_ARTICLE_CONFIG: `${API_HEAD}/update-article-config`,
  UPDATE_HTML_CONFIG: `${API_HEAD}/update-html-config`,
  UPDATE_BLOCK_CONFIG: `${API_HEAD}/update-block-config`,
  UPDATE_RSS_CONFIG: `${API_HEAD}/update-rss-config`,

  // delete
  DELETE_ACCOUNT: `${API_HEAD}/delete-account`,
  DELETE_WEBSITE: `${API_HEAD}/delete-website`,
  DELETE_CATEGORY: `${API_HEAD}/delete-category`,
  DELETE_CONFIG: `${API_HEAD}/delete-config`,
  DELETE_HTML_CONFIG: `${API_HEAD}/delete-html-config`,
  DELETE_BLOCK_CONFIG: `${API_HEAD}/delete-block-config`,
  DELETE_RSS_CONFIG: `${API_HEAD}/delete-rss-config`,

  // check
  CHECK_ACCOUNT_EXIST: `${API_HEAD}/is-account-existed`,
  CHECK_WEBSITE_EXIST: `${API_HEAD}/is-website-existed`,
  CHECK_CATEGORY_EXIST: `${API_HEAD}/is-category-existed`,

  // statistic
  STATISTIC: `${API_HEAD}/statistic`,
  STATISTIC_BY_TYPE: `${API_HEAD}/statistic-by-type`,

  // process
  CRAWL_ARTICLE: `${API_HEAD}/crawl/article`,
  NORMALIZE_ARTICLE: `${API_HEAD}/normalize-article`,
  NORMALIZE_WORD: `${API_HEAD}/normalize-word`,
  SYNTHETIC_ARTICLE: `${API_HEAD}/synthetic-article`,
  FINISH_NORMALIZE: `${API_HEAD}/finish-normalize`,
  RE_RUN_SCHEDULES: `${API_HEAD}/crawl/re-run`,
};
