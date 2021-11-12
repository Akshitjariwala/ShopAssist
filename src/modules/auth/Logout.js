import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

//! User Files

import * as ActionTypes from "common/actionTypes";
import { AppContext } from "AppContext";
import { ROUTES } from "common/constants";
import { auth } from "_firebase";
import { toast } from "common/utils";

const Logout = () => {
  const { dispatch } = useContext(AppContext);
  const { push } = useHistory();
  useEffect(() => {
    auth
      .signOut()
      .then(() => {
        dispatch({ type: ActionTypes.LOGOUT });
        push(ROUTES.LOGIN);
      })
      .catch((err) => {
        toast({
          message: err.message,
          type: "error",
        });
        push(ROUTES.MAIN);
      });
    // eslint-disable-next-line
  }, []);

  return <div />;
};

export default Logout;
