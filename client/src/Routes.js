import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//! User Files

import * as ActionTypes from "common/actionTypes";
import { AppContext } from "AppContext";
import { ROUTES, USER } from "common/constants";
import App from "app/App";
import Login from "modules/auth/Login";
import Logout from "modules/auth/Logout";
import PrivateRoute from "./PrivateRoute";
import Signup from "modules/auth/Signup";
import ForgetPassword from "modules/auth/ForgetPassword";
import VerifySignup from "modules/auth/VerifySignup";
import ResetPassword from "modules/auth/ResetPassword";
import ResendConfirmationCode from "modules/auth/ResendConfirmationCode";

const Routes = () => {
  const { initializeAuth, dispatch } = useContext(AppContext);

  useEffect(() => {
    initializeAuth();
    if (localStorage.getItem(USER)) {
      const user = JSON.parse(localStorage.getItem(USER));
      const expiryTime = user.expiryTime;
      const currentTime = Date.now();
      if (expiryTime < currentTime) {
        dispatch({ type: ActionTypes.LOGOUT });
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path={ROUTES.LOGIN} component={Login} />
        <Route exact path={ROUTES.REGISTER} component={Signup} />
        <Route exact path={ROUTES.VERIFY_SIGNUP} component={VerifySignup} />
        <Route exact path={ROUTES.FORGET_PASSWORD} component={ForgetPassword} />
        <Route exact path={ROUTES.RESET_PASSWORD} component={ResetPassword} />
        <Route
          exact
          path={ROUTES.RESEND_CODE}
          component={ResendConfirmationCode}
        />
        <Route exact path={ROUTES.LOGOUT} component={Logout} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </Router>
  );
};
export default Routes;
