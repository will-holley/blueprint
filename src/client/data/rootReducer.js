import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
//* Reducers
import uiReducer from "./services/ui/reducer";
import apiReducer from "./services/api/reducer";
import userReducer from "./services/user/reducer";
import documentReducer from "./services/document/reducer";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    ui: uiReducer,
    api: apiReducer,
    user: userReducer,
    documents: documentReducer
  });

export default createRootReducer;
