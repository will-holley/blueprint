import API from "../../../graphql/api";

import { requestFailed } from "client/data/services/api/actions";

import { USER_LOADED, USER_LOGGED_OUT } from "./constants";

/**
 * Callback from `actions.login` and `actions.join`
 */
export const logout = () => async dispatch => {
  API.deAuthenticate();
  return dispatch({ type: USER_LOGGED_OUT });
};

const handleAuthResponse = response => dispatch => {
  //? Check for error message
  if (response.error) {
    return requestFailed(response.error);
  }

  //? Add the jwt to all requests going forward the auth header
  if (response.token) {
    API.authenticate(response.token);
  }
  //? Add user info to the store
  return dispatch({ type: USER_LOADED, user: response.user });
};

export const login = (email, password) => async dispatch => {
  try {
    const response = await API.request(
      "/user/login",
      "post",
      {},
      { email, password }
    );
    return dispatch(handleAuthResponse(response));
  } catch (error) {
    return requestFailed(error);
  }
};

export const join = (name, email, password) => async dispatch => {
  try {
    const response = await API.request(
      "/user/register",
      "post",
      {},
      { name, email, password }
    );
    return dispatch(handleAuthResponse(response));
  } catch (error) {
    return requestFailed(error);
  }
};

/**
 * On application load, if there is a jwt token, load the
 * currently logged in user.
 */
export const loadUser = () => async (dispatch, getState) => {
  const {
    user: { id }
  } = getState();

  //? If the API has not been authenticated, there is nothing to request.
  //? If there is already a user in the state, don't re-request.
  if (!API.isAuthenticated || Boolean(id)) return;

  //? Fetch the user's information.
  try {
    const response = await API.request("/user", "get");
    //? Check if the token has expired.
    if (response.error && response.error.expired) {
      return logout();
    } else if (response.hasOwnProperty("id")) {
      return dispatch({ type: USER_LOADED, user: response });
    }
  } catch (error) {
    console.log(error);
    return requestFailed(error);
  }
};
