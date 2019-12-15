import {
  createStore,
  createSubscriber,
  createHook,
  defaults
} from "react-sweet-state";
import update from "immutability-helper";
import uuidv4 from "uuid/v4";

// Config
defaults.devtools = process.env.NODE_ENV == "development";

const createDoc = () => ({
  id: uuidv4(),
  nodes: {}
});

const createNode = parentId => ({
  id: uuidv4(),
  parentId
});

// Create an initial document for now.  This suffices until multi-doc trees
// are added.
const initialDoc = createDoc();

const initialState = {
  documents: {
    [initialDoc.id]: initialDoc
  }
};

const actions = {
  addNode: parentNodeId => ({ setState, getState }) => {
    const state = getState();
    // Create new node
    const node = createNode(parentNodeId);
    const newState = update(state, {
      documents: {
        [initialDoc.id]: {
          nodes: {
            [node.id]: { $set: node }
          }
        }
      }
    });
    setState(newState);
  }
};

const store = createStore({
  initialState,
  actions,
  name: "globalStore"
});

const Store = createSubscriber(store);
const useStore = createHook(store);

export default Store;
export { useStore };
