import update from "immutability-helper";

import {
  API_REQUESTED,
  API_REQUEST_SUCCEEDED,
  API_REQUEST_FAILED
} from "./constants";

const initialState = {
  isRequesting: false,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case API_REQUESTED: {
      return update(state, {
        isRequesting: { $set: true },
        error: { $set: null }
      });
    }
    case API_REQUEST_SUCCEEDED: {
      return update(state, {
        isRequesting: { $set: false }
      });
    }
    case API_REQUEST_FAILED: {
      console.log(action.error);
      return update(state, {
        isRequesting: { $set: false },
        error: { $set: action.error.message }
      });
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };
