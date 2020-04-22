/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Configuration from '../../views/Content/Configuration';
import ListValidArticles from '../../views/Content/ListValidArticles';
import ListInvalidArticles from '../../views/Content/ListInvalidArticles';
import Reports from '../../views/Content/Reports';
import AddConfig from '../../views/Content/Configuration/AddConfig/AddConfig';
import ArticleConfig from '../../views/Content/Configuration/ArticleConfig/ArticleConfig';
import Statistics from '../../views/Content/Statistics';
import PrivateRoute from '../../PrivateRoute';

export default function ContentRoute() {
  return (
    <Switch>
      <PrivateRoute path="/dashboard/configuration" exact component={Configuration} />
      <PrivateRoute path="/dashboard/configuration/add-config" exact component={AddConfig} />
      <PrivateRoute path="/dashboard/configuration/article-config/:configId" exact component={ArticleConfig} />
      <PrivateRoute path="/dashboard/list-valid-articles" exact component={ListValidArticles} />
      <PrivateRoute path="/dashboard/list-invalid-articles" exact component={ListInvalidArticles} />
      <PrivateRoute path="/dashboard/reports" exact component={Reports} />
      <PrivateRoute path="/dashboard/statistics" exact component={Statistics} />
      <Redirect from="/dashboard" to="/dashboard/configuration" />
    </Switch>
  );
}
