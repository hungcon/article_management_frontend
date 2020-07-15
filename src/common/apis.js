/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/prefer-default-export
require('dotenv').config();

const { REACT_APP_API_URL } = process.env;
export const API_ENDPOINT = {
  SIGN_IN: `${REACT_APP_API_URL}/sign-in`,

  // get
  GET_CONFIGURATION: `${REACT_APP_API_URL}/get-configuration`,
  GET_WEBSITES: `${REACT_APP_API_URL}/get-websites`,
  GET_CATEGORIES: `${REACT_APP_API_URL}/get-categories`,
  GET_ACCOUNT: `${REACT_APP_API_URL}/get-account`,
  GET_USER_INFO: `${REACT_APP_API_URL}/get-user-info`,
  GET_LIST_ACCOUNTS: `${REACT_APP_API_URL}/get-list-accounts`,
  GET_VALID_ARTICLES: `${REACT_APP_API_URL}/get-valid-articles`,
  GET_PENDING_ARTICLES: `${REACT_APP_API_URL}/get-pending-articles`,
  GET_INVALID_ARTICLES: `${REACT_APP_API_URL}/get-invalid-articles`,
  GET_CONFIG_BY_WEBSITE: `${REACT_APP_API_URL}/get-config-by-website`,
  GET_ARTICLE_CONFIG: `${REACT_APP_API_URL}/get-article-config`,
  GET_VALID_ARTICLE_BY_ID: `${REACT_APP_API_URL}/get-valid-article-by-id`,
  GET_QUEUE_LENGTH: `${REACT_APP_API_URL}/get-queue-length`,

  // add
  ADD_ACCOUNT: `${REACT_APP_API_URL}/add-account`,
  ADD_WEBSITE: `${REACT_APP_API_URL}/add-website`,
  ADD_CATEGORY: `${REACT_APP_API_URL}/add-category`,
  ADD_VALID_ARTICLE: `${REACT_APP_API_URL}/add-valid-articles`,
  ADD_CONFIG: `${REACT_APP_API_URL}/add-config`,
  ADD_HTML_CONFIG: `${REACT_APP_API_URL}/add-html-config`,
  ADD_RSS_CONFIG: `${REACT_APP_API_URL}/add-rss-config`,
  ADD_BLOCK_CONFIG: `${REACT_APP_API_URL}/add-block-config`,

  // update
  UPDATE_ACCOUNT: `${REACT_APP_API_URL}/update-account`,
  UPDATE_WEBSITE: `${REACT_APP_API_URL}/update-website`,
  UPDATE_CATEGORY: `${REACT_APP_API_URL}/update-category`,
  UPDATE_PASSWORD: `${REACT_APP_API_URL}/update-password`,
  UPDATE_CONFIG: `${REACT_APP_API_URL}/update-config`,
  UPDATE_ARTICLE_CONFIG: `${REACT_APP_API_URL}/update-article-config`,
  UPDATE_HTML_CONFIG: `${REACT_APP_API_URL}/update-html-config`,
  UPDATE_BLOCK_CONFIG: `${REACT_APP_API_URL}/update-block-config`,
  UPDATE_RSS_CONFIG: `${REACT_APP_API_URL}/update-rss-config`,

  // delete
  DELETE_VALID_ARTICLE: `${REACT_APP_API_URL}/delete-valid-article`,
  DELETE_ACCOUNT: `${REACT_APP_API_URL}/delete-account`,
  DELETE_WEBSITE: `${REACT_APP_API_URL}/delete-website`,
  DELETE_CATEGORY: `${REACT_APP_API_URL}/delete-category`,
  DELETE_CONFIG: `${REACT_APP_API_URL}/delete-config`,
  DELETE_HTML_CONFIG: `${REACT_APP_API_URL}/delete-html-config`,
  DELETE_BLOCK_CONFIG: `${REACT_APP_API_URL}/delete-block-config`,
  DELETE_RSS_CONFIG: `${REACT_APP_API_URL}/delete-rss-config`,

  // check
  CHECK_ACCOUNT_EXIST: `${REACT_APP_API_URL}/is-account-existed`,
  CHECK_WEBSITE_EXIST: `${REACT_APP_API_URL}/is-website-existed`,
  CHECK_CATEGORY_EXIST: `${REACT_APP_API_URL}/is-category-existed`,

  // statistic
  STATISTIC: `${REACT_APP_API_URL}/statistic`,
  STATISTIC_BY_TYPE: `${REACT_APP_API_URL}/statistic-by-type`,

  // process
  CRAWL_ARTICLE: `${REACT_APP_API_URL}/crawl/article`,
  NORMALIZE_ARTICLE: `${REACT_APP_API_URL}/normalize-article`,
  NORMALIZE_WORD: `${REACT_APP_API_URL}/normalize-word`,
  SYNTHETIC_ARTICLE: `${REACT_APP_API_URL}/synthetic-article`,
  DENY_ARTICLE: `${REACT_APP_API_URL}/deny-article`,
  FINISH_NORMALIZE: `${REACT_APP_API_URL}/finish-normalize`,
  RE_RUN_SCHEDULES: `${REACT_APP_API_URL}/crawl/re-run`,
};
