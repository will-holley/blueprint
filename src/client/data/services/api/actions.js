import {
  API_REQUESTED,
  API_REQUEST_SUCCEEDED,
  API_REQUEST_FAILED
} from "./constants";

export const isRequesting = () => ({ type: API_REQUESTED });
export const requestSucceeded = () => ({ type: API_REQUEST_SUCCEEDED });
export const requestFailed = error => ({ type: API_REQUEST_FAILED, error });
