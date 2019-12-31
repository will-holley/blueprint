import {
  createStore,
  createSubscriber,
  createHook,
  defaults
} from "react-sweet-state";
// State
import initialState from "./state";
// Actions
import { default as docActions } from "./actions/document";
import { default as uiActions } from "./actions/ui";
import { default as userActions } from "./actions/user";

// Config
defaults.devtools = process.env.NODE_ENV == "development";

const actions = [docActions, uiActions, userActions];

const store = createStore({
  initialState,
  actions: Object.assign({}, ...actions),
  name: "globalStore"
});

//const Store = createSubscriber(store);
const useStore = createHook(store);

export default useStore;
export { store };
