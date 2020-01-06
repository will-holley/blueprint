import update from "immutability-helper";

import { USER_LOADED, USER_LOGGED_OUT } from "./constants";

const initialState = {
  id: null,
  email: null,
  name: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADED: {
      const { user } = action;
      return update(state, {
        id: { $set: user.id },
        email: { $set: user.email },
        name: { $set: user.name }
      });
    }
    case USER_LOGGED_OUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };
