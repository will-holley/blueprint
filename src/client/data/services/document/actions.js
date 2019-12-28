import update from "immutability-helper";
import { request } from "client/utils/api";

const actions = {
  populateAllDocuments: () => async ({ setState, getState }) => {
    // TODO: check if there are any documents we don't have
    // TODO: or set up pagination?
    // TODO: all in all decide on an appropriate way to handle
    // TODO: fetching and pagination
    // Check if documents have been populated
    const { documents } = getState();
    if (Object.keys(documents).length) return;
    // If not, fetch them
    const response = await request("document", "GET");
    // Map to a dict with the empty nodes and edges arrays.
    const documentMap = response.reduce(
      (obj, doc) => ({ ...obj, [doc.id]: { ...doc, nodes: [], edges: [] } }),
      {}
    );
    setState({
      documents: documentMap
    });
  },
  /**
   * Look up the id of the request document.
   */
  setActiveDocument: humanId => ({ setState, getState }) => {
    const state = getState();
    const [id, _] = Object.entries(state.documents).find(
      ([id, doc]) => doc.humanId === humanId
    );
    const newState = update(state, {
      currentDoc: {
        id: { $set: id },
        // reset zoom back to default
        zoom: { $set: 1 }
      }
    });
    setState(newState);
  },
  zoomIn: () => ({ setState, getState }) => {
    const state = getState();
    const newZoom = state.currentDoc.zoom + 0.1;
    const newState = update(state, {
      currentDoc: {
        zoom: { $set: newZoom }
      }
    });
    setState(newState);
  },
  zoomOut: () => ({ setState, getState }) => {
    const state = getState();
    const newZoom = state.currentDoc.zoom - 0.1;
    const newState = update(state, {
      currentDoc: {
        zoom: { $set: newZoom }
      }
    });
    setState(newState);
  },
  resetZoom: () => ({ setState, getState }) => {
    const state = getState();
    const newState = update(state, {
      currentDoc: {
        zoom: { $set: 1 }
      }
    });
    setState(newState);
  }
};

export default actions;
