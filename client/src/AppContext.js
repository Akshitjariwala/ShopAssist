import { createContext, useReducer } from "react";

//! User Files

import * as ActionTypes from "common/actionTypes";
import api from "common/api";
import { ID_TOKEN, TOKEN, USER, USER_ID } from "common/constants";

const getLoggedInUser = () => {
  let loggedInUser = localStorage.getItem(USER);
  loggedInUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  return loggedInUser;
};

const getUserId = () => {
  return localStorage.getItem(USER_ID) ? localStorage.getItem(USER_ID) : "";
};

const initialState = {
  currentUser: getLoggedInUser() || {},
  userId: getUserId(),
  authToken: localStorage.getItem(TOKEN),
  idToken: localStorage.getItem(ID_TOKEN),
  authenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    //! USER
    case ActionTypes.SET_CURRENT_USER:
      const user = action.data || {};
      localStorage.setItem(
        USER,
        user && Object.keys(user).length ? JSON.stringify(user) : null
      );
      return { ...state, currentUser: { ...user } };
    case ActionTypes.SET_USER_ID:
      localStorage.setItem(USER_ID, action.data);
      return { ...state, userId: action.data };
    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, authenticated: action.data };
    case ActionTypes.SET_ACCESS_TOKEN:
      api.defaults.headers.common = {
        Authorization: `Bearer ${action.data}`,
      };
      localStorage.setItem(TOKEN, action.data);
      return { ...state, authToken: action.data };
    //! ID TOKEN
    case ActionTypes.SET_ID_TOKEN:
      localStorage.setItem(ID_TOKEN, action.data);
      return { ...state, idToken: action.data };
    //! LOGOUT
    case ActionTypes.LOGOUT:
      delete api.defaults.headers.common.Authorization;
      localStorage.clear();
      return {
        ...initialState,
        authenticated: false,
        authToken: null,
        idToken: null,
        currentUser: {},
      };
    default:
      return { ...state };
  }
};

const AppContext = createContext({
  state: initialState,
  dispatch: () => {},
});

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getAccessToken = () => {
    return localStorage.getItem(TOKEN) || null;
  };

  const getIdToken = () => {
    return localStorage.getItem(ID_TOKEN) || null;
  };

  // eslint-disable-next-line
  const getCurrentUser = () => {
    return localStorage.getItem(USER)
      ? JSON.parse(localStorage.getItem(USER))
      : {};
  };

  const initializeAuth = (authToken) => {
    const accessToken = authToken || getAccessToken();
    const idToken = getIdToken || "";
    const user = getCurrentUser();
    const userId = getUserId();
    if (accessToken) {
      api.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
      };
      dispatch({ type: ActionTypes.SET_ACCESS_TOKEN, data: accessToken });
      dispatch({ type: ActionTypes.SET_ID_TOKEN, data: idToken });
      dispatch({ type: ActionTypes.SET_AUTHENTICATED, data: true });
      dispatch({ type: ActionTypes.SET_CURRENT_USER, data: user });
      dispatch({ type: ActionTypes.SET_USER_ID, data: userId });
    }
  };

  const value = {
    state,
    dispatch,
    initializeAuth,
    getAccessToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
