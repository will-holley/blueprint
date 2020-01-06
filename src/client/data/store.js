//* Libraries
import { applyMiddleware, compose, createStore } from "redux";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
//* Configuration
import createRootReducer from "./rootReducer";
import { initialState as uiState } from "./services/ui/reducer";
import { initialState as apiState } from "./services/api/reducer";
import { initialState as userState } from "./services/user/reducer";
import { initialState as documentState } from "./services/document/reducer";

//? Compose the initial state
const initialState = {
  ui: uiState,
  api: apiState,
  user: userState,
  documents: documentState
};

const history = createBrowserHistory();
const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

//? Add Redux Dev Tools in development
if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(
  createRootReducer(history),
  initialState,
  composedEnhancers
);

export default store;
export { history };
