import { createDoc } from "./models/document/utils";

const initialState = {
  // TODO: It may be necessary to switch to a documents/nodes/edges flat structure.
  documents: {},
  currentDoc: {
    id: null,
    dimensions: {
      height: window.innerHeight,
      width: window.innerWidth
    },
    // Hotkeys, etc.
    activeNodeId: null
  }
};

export default initialState;
