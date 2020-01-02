import update from "immutability-helper";
import {
  request,
  attachBearerToAPI,
  userToken,
  clearUserToken
} from "client/utils/api";

const actions = {
  /**
   * On application load, if there is a jwt token, load the
   * currently logged in user.
   */
  loadUser: () => async ({ setState }) => {
    //? If there is no jwt, there is nothing to request.
    if (!userToken()) return;
    //? Fetch the user's information.
    try {
      const response = await request("/user", "get");
      if (response.id) {
        // TODO: load private documents
        setState({ user: response });
      }
    } catch (error) {
      //clearUserToken();
      return { error: error.message ? error.message : error };
    }
  },
  /**
   * Callback from `actions.login` and `actions.join`
   */
  handleAuthResponse: response => ({ setState }) => {
    //? Check for error message
    if (response.error) return response;
    //? Add the jwt to all requests going forward the auth header
    if (response.token) {
      window.localStorage.setItem("userToken", response.token);
    }
    //? Add user info to the store
    setState({ user: response.user });
    //? All API requests should contain token
    attachBearerToAPI();
  },
  logout: () => async ({ setState }) => {
    clearUserToken();
    setState({ user: null });
  },
  login: (email, password) => async ({ setState, dispatch }) => {
    try {
      const response = await request(
        "/user/login",
        "post",
        {},
        { email, password }
      );
      return dispatch(actions.handleAuthResponse(response));
    } catch (error) {
      return { error: error.message ? error.message : error };
    }
  },
  join: (name, email, password) => async ({ setState, dispatch }) => {
    try {
      const response = await request(
        "/user/register",
        "post",
        {},
        { name, email, password }
      );
      return dispatch(actions.handleAuthResponse(response));
    } catch (error) {
      return { error: error.message ? error.message : error };
    }
  }
};

export default actions;
