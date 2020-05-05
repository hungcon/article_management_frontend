/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Configuration from '../../views/Content/Configuration';
import ListValidArticles from '../../views/Content/ListValidArticles';
import ListInvalidArticles from '../../views/Content/ListInvalidArticles';
import CleanText from '../../views/Content/CleanText';
import CleanOption from '../../views/Content/CleanOption';
import AddConfig from '../../views/Content/Configuration/AddConfig/AddConfig';
import ArticleConfig from '../../views/Content/Configuration/ArticleConfig/ArticleConfig';
import Statistics from '../../views/Content/Statistics';
import PrivateRoute from '../../PrivateRoute';
import ArticleForm from '../../views/Article/ArticleForm';

export default function ContentRoute() {
  return (
    <Switch>
      <PrivateRoute path="/dashboard/configuration" exact component={Configuration} />
      <PrivateRoute path="/dashboard/configuration/add-config" exact component={AddConfig} />
      <PrivateRoute path="/dashboard/configuration/article-config/:configId" exact component={ArticleConfig} />
      <PrivateRoute path="/dashboard/list-valid-articles" exact component={ListValidArticles} />
      <PrivateRoute path="/dashboard/list-valid-articles/:articleId" exact component={ArticleForm} />
      <PrivateRoute path="/dashboard/list-invalid-articles" exact component={ListInvalidArticles} />
      <PrivateRoute path="/dashboard/clean-text" exact component={CleanText} />
      <PrivateRoute path="/dashboard/clean-text/:cleanArticleId" exact component={CleanOption} />
      <PrivateRoute path="/dashboard/statistics" exact component={Statistics} />
      <Redirect from="/dashboard" to="/dashboard/configuration" />
    </Switch>
  );
}
