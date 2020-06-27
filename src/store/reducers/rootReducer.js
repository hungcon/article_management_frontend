/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import account from './accountReducer';
import config from './configReducer';

export const rootReducer = combineReducers({
  account,
  config,
});
