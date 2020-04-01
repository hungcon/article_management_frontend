/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import user from './userReducer';
import test from './testReducer';

export const rootReducer = combineReducers({
  user,
  test,
});
