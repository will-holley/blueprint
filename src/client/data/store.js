import {
  createStore,
  createSubscriber,
  createHook,
  defaults
} from "react-sweet-state";
// State
import initialState from "./state";
// Actions
import { default as docActions } from "./models/document/actions";
import { default as graphActions } from "./models/graph/actions";

// Config
defaults.devtools = process.env.NODE_ENV == "development";

const store = createStore({
  initialState,
  actions: Object.assign({}, ...[docActions, graphActions]),
  name: "globalStore"
});

//const Store = createSubscriber(store);
const useStore = createHook(store);

export default useStore;
export { store };
