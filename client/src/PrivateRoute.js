import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AppContext } from "./AppContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { getToken } = useContext(AppContext);
  const idToken = getToken() || "remove"; //TODO: Remove this once code is not static
  return (
    <Route
      {...rest}
      render={(props) =>
        !idToken ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};
export default PrivateRoute;
