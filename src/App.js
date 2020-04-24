/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './views/Dashboard/Dashboard';
import SignIn from './views/Template/SignIn';
import SignUp from './views/Template/SignUp';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/sign-up" exact component={SignUp} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
    </Switch>
  );
}

export default App;
