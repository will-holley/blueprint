import update from "immutability-helper";

import { SET_LOADING } from "./constants";

const initialState = {
  // application starts loading by default
  loading: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING: {
      return update(state, {
        loading: { $set: action.loading }
      });
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };
