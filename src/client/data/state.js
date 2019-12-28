const initialState = {
  // TODO: It may be necessary to switch to a documents/nodes/edges flat structure.
  documents: {},
  currentDoc: {
    id: null,
    dimensions: {
      height: window.innerHeight,
      width: window.innerWidth
    },
    // 1 by default
    zoom: 1,
    // Hotkeys, etc.
    activeNodeId: null
  },
  ui: {
    // By default the application starts loading
    loading: true
  }
};

export default initialState;
