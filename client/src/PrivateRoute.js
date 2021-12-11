import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AppContext } from "./AppContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { getAccessToken } = useContext(AppContext);
  const accessToken = getAccessToken();
  return (
    <Route  
      {...rest}
      render={(props) =>
        !accessToken ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};
export default PrivateRoute;
