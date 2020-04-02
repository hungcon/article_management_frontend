/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import user from './userReducer';
import config from './configReducer';

export const rootReducer = combineReducers({
  user,
  config,
});
