import { createDoc } from "./models/document";

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

//! Create an initial document for now. This suffices until multi-doc trees are added.
const initialDoc = createDoc();
initialState.documents[initialDoc.id] = initialDoc;
initialState.currentDoc.id = initialDoc.id;

export default initialState;
