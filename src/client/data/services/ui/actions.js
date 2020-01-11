import {
  SET_LOADING,
  TOGGLE_DASHBOARD_VISIBILITY_FILTER,
  TOGGLE_DELETED_VISIBILITY
} from "./constants";

export const setLoading = loading => ({
  type: SET_LOADING,
  loading
});

export const toggleDashboardVisibilityFilter = () => ({
  type: TOGGLE_DASHBOARD_VISIBILITY_FILTER
});

export const toggleDeletedVisibility = () => ({
  type: TOGGLE_DELETED_VISIBILITY
});
