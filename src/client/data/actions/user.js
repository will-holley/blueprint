import update from "immutability-helper";
import API from "client/utils/api";

const actions = {
  /**
   * On application load, if there is a jwt token, load the
   * currently logged in user.
   */
  loadUser: () => async ({ setState, getState, dispatch }) => {
    const state = getState();
    //? If the API has not been authenticated, there is nothing to request.
    //? If there is already a user in the state, don't re-request.
    if (!API.isAuthenticated || Boolean(state.user)) return;
    //? Fetch the user's information.
    try {
      const response = await API.request("/user", "get");
      //? Check if the token has expired.
      if (response.error && response.error.expired) {
        return dispatch(actions.logout());
      } else if (response.hasOwnProperty("id")) {
        // TODO: load private documents
        setState({ user: response });
      }
    } catch (error) {
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
      API.authenticate(response.token);
    }
    //? Add user info to the store
    setState({ user: response.user });
  },
  logout: () => async ({ setState }) => {
    API.deAuthenticate();
    setState({ user: null });
  },
  login: (email, password) => async ({ setState, dispatch }) => {
    try {
      const response = await API.request(
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
      const response = await API.request(
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
