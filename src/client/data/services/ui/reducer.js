import update from "immutability-helper";

import {
  SET_LOADING,
  TOGGLE_DASHBOARD_VISIBILITY_FILTER,
  TOGGLE_DELETED_VISIBILITY
} from "./constants";

const initialState = {
  // application starts loading by default
  loading: true,
  dashboard: {
    showDeleted: false,
    // Show all by default
    filter: "public"
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING: {
      return update(state, {
        loading: { $set: action.loading }
      });
    }
    case TOGGLE_DASHBOARD_VISIBILITY_FILTER: {
      const updatedFilter =
        state.dashboard.filter === "private" ? "public" : "private";
      return update(state, {
        dashboard: {
          filter: {
            $set: updatedFilter
          }
        }
      });
    }
    case TOGGLE_DELETED_VISIBILITY: {
      return update(state, {
        dashboard: {
          showDeleted: { $set: !state.dashboard.showDeleted }
        }
      });
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };
