/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Configuration from '../../views/Content/Configuration';
import ListValidArticles from '../../views/Content/Article/ListValidArticles';
import ListInvalidArticles from '../../views/Content/Article/ListInvalidArticles';
import NormalizedArticle from '../../views/Content/NormalizedArticle';
import AddConfig from '../../views/Content/Configuration/AddConfig/AddConfig';
import ArticleConfig from '../../views/Content/Configuration/ArticleConfig/ArticleConfig';
import Statistics from '../../views/Content/Statistics';
import PrivateRoute from '../../PrivateRoute';
import AddArticle from '../../views/Article/AddArticle';
import ListWebsite from '../../views/Content/Website/ListWebsite';
import ListCategory from '../../views/Content/Category/ListCategory';
import ListAccounts from '../../views/Content/Account/ListAccounts';
import AccountForm from '../../views/Content/Account/AccountForm';
import NormalizeWord from '../../views/Content/NormalizeWord';

export default function ContentRoute() {
  return (
    <Switch>
      <PrivateRoute path="/dashboard/configuration" exact component={Configuration} />
      <PrivateRoute path="/dashboard/list-accounts" exact component={ListAccounts} />
      <PrivateRoute path="/dashboard/list-accounts/add-account" exact component={AccountForm} />
      <PrivateRoute path="/dashboard/list-accounts/edit-account/:accountId" exact component={AccountForm} />
      <PrivateRoute path="/dashboard/list-website" exact component={ListWebsite} />
      <PrivateRoute path="/dashboard/list-category" exact component={ListCategory} />
      <PrivateRoute path="/dashboard/configuration/add-config" exact component={AddConfig} />
      <PrivateRoute path="/dashboard/configuration/article-config/:configId" exact component={ArticleConfig} />
      <PrivateRoute path="/dashboard/list-valid-articles" exact component={ListValidArticles} />
      <PrivateRoute path="/dashboard/list-valid-articles/:articleId" exact component={NormalizedArticle} />
      <PrivateRoute path="/dashboard/list-invalid-articles" exact component={ListInvalidArticles} />
      <PrivateRoute path="/dashboard/list-valid-articles/:articleId/:type/:word" exact component={NormalizeWord} />
      <PrivateRoute path="/dashboard/add-article" exact component={AddArticle} />
      <PrivateRoute path="/dashboard/statistics" exact component={Statistics} />
      <Redirect to="/dashboard/list-valid-articles" />
    </Switch>
  );
}
