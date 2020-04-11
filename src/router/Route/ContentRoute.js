/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Configuration from '../../views/Content/Configuration';
import LogChart from '../../views/Content/LogChart';
import Accounts from '../../views/Content/Accounts';
import Reports from '../../views/Content/Reports';
import AddConfig from '../../views/Content/Configuration/AddConfig/AddConfig';
import Statistics from '../../views/Content/Statistics';
import PrivateRoute from '../../PrivateRoute';

export default function ContentRoute() {
  return (
    <Switch>
      <PrivateRoute path="/dashboard/configuration" exact component={Configuration} />
      <PrivateRoute path="/dashboard/configuration/add-config" exact component={AddConfig} />
      <PrivateRoute path="/dashboard/log-chart" exact component={LogChart} />
      <PrivateRoute path="/dashboard/accounts" exact component={Accounts} />
      <PrivateRoute path="/dashboard/reports" exact component={Reports} />
      <PrivateRoute path="/dashboard/statistics" exact component={Statistics} />
      <Redirect from="/dashboard" to="/dashboard/configuration" />
    </Switch>
  );
}
