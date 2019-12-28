import {
  createStore,
  createSubscriber,
  createHook,
  defaults
} from "react-sweet-state";
// State
import initialState from "./state";
// Actions
import { default as docActions } from "./services/document/actions";
import { default as graphActions } from "./services/graph/actions";
import { default as uiActions } from "./services/ui/actions";

// Config
defaults.devtools = process.env.NODE_ENV == "development";

const actions = [docActions, graphActions, uiActions];

const store = createStore({
  initialState,
  actions: Object.assign({}, ...actions),
  name: "globalStore"
});

//const Store = createSubscriber(store);
const useStore = createHook(store);

export default useStore;
export { store };
