import {
  createStore,
  createSubscriber,
  createHook,
  defaults
} from "react-sweet-state";
// State
import initialState from "./state";
// Actions
import { actions as docActions } from "./models/document";
import { default as nodeActions } from "./models/node/actions";

// Config
defaults.devtools = process.env.NODE_ENV == "development";

const store = createStore({
  initialState,
  actions: Object.assign({}, ...[docActions, nodeActions]),
  name: "globalStore"
});

//const Store = createSubscriber(store);
const useStore = createHook(store);

export default useStore;
