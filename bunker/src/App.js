import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './commonComponents/Navigation';

import LandingPage from './pages/Landing/Landing';
import SignUpPage from './pages/SignUp/SignUp';
import SignInPage from './pages/SignIn/SignIn';
import PasswordForgetPage from './pages/PasswordForget/PasswordForget';
import HomePage from './pages/Home/Home';
import AccountPage from './pages/Account/Account';
import AdminPage from './pages/Admin/Admin';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './server/Session';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
);

export default withAuthentication(App);