import { Route, Switch } from "react-router-dom";
import React from 'react';

//! User Files

import { ROUTES } from "common/constants";
import Dashboard from "modules/dashboard";
import Error404 from "Error404";

const ContentRoutes = () => {
  const renderRoutes = (
    <Switch>
      <Route path={ROUTES.MAIN} exact component={Dashboard} />
      <Route path="*" exact component={Error404} />
    </Switch>
  );

  return renderRoutes;
};

export default ContentRoutes;
