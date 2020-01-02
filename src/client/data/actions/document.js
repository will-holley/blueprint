import update from "immutability-helper";
import API from "client/utils/api";

//TODO: go through actions and use `dispatch` to decompose them,
//TODO: particularly the actions having to do with node position
//TODO: computation.

const actions = {
  //! ======================
  //! == Document Actions ==
  //! ======================
  updateDocumentName: (docId, name) => async ({ setState, getState }) => {
    const state = getState();
    //? If the user deletes the full text, do not save
    try {
      if (name !== "") {
        await API.request(`document/${docId}`, "PUT", {}, { name });
      }
      console.log(name);
      const newState = update(state, {
        documents: {
          [docId]: {
            name: { $set: name }
          }
        }
      });
      setState(newState);
    } catch (error) {
      console.log(error);
      //TODO
    }
  },
  populateAllDocuments: () => async ({ setState }) => {
    // TODO: search + pagination + caching
    const response = await API.request("document", "GET");
    setState({ documents: response });
  },
  /**
   * Lookup the document id corresponding to this humanId and load
   * all nodes for that document if they have not yet been loaded.
   * Nodes are not loaded by default when documents are populated.
   * @param {string} humanId : the human id of this doc
   * @param {string} activeNodeId : the node which should be active when the doc re-renders
   * @param {number} zoom : the zoom level this document should re-render at
   */
  setActiveDocument: (humanId, activeNodeId = undefined, zoom = 1) => async ({
    setState,
    getState
  }) => {
    const state = getState();
    //? Check if active doc is being unset
    if (!humanId) {
      setState(
        update(state, {
          currentDoc: {
            id: { $set: null }
          }
        })
      );
      return;
    }
    //? Look up the id which corresponds to this human id
    const [id, _] = Object.entries(state.documents).find(
      ([id, doc]) => doc.humanId === humanId
    );
    //? Query document details
    //TODO: determine when these should be cached
    const { nodes, edges } = await API.request(`document/${id}`, "GET");

    //? Make the base node the active node
    const baseNode = Object.values(nodes).find(({ isBase }) => isBase);

    //? Update the state
    const newState = update(state, {
      currentDoc: {
        id: { $set: id },
        // reset zoom back to default
        zoom: { $set: zoom },
        activeNodeId: {
          $set: activeNodeId ? activeNodeId : baseNode ? baseNode.id : null
        }
      },
      documents: {
        [id]: {
          nodes: { $set: nodes },
          edges: { $set: edges }
        }
      }
    });
    setState(newState);
  },
  setZoom: newZoom => ({ setState, getState }) => {
    const newState = update(getState(), {
      currentDoc: {
        zoom: { $set: newZoom }
      }
    });
    setState(newState);
  },
  zoomIn: () => ({ getState, dispatch }) => {
    const state = getState();
    const newZoom = state.currentDoc.zoom + 0.1;
    dispatch(actions.setZoom(newZoom));
  },
  zoomOut: () => ({ getState, dispatch }) => {
    const state = getState();
    const newZoom = state.currentDoc.zoom - 0.1;
    dispatch(actions.setZoom(newZoom));
  },
  resetZoom: () => ({ dispatch }) => {
    dispatch(actions.setZoom(1));
  },
  createDocument: () => async ({ setState, getState }) => {
    const state = getState();
    const document = await API.request("document", "POST");
    const newState = update(state, {
      documents: {
        [document.id]: { $set: document }
      }
    });
    setState(newState);
    return document.humanId;
  },
  //! ==================
  //! == Node Actions ==
  //! ==================
  /**
   * Adds a new node to document
   */
  addNode: parentNodeId => async ({ setState, getState }) => {
    const state = getState();
    const { id, nodes, edges } = state.documents[state.currentDoc.id];

    //? Create default node and add it to nodes before update nodes positions
    const [node, edge] = await API.request(
      "node",
      "POST",
      {},
      {
        documentId: id,
        parentNodeId: parentNodeId
      }
    );

    //? Add node to nodes map
    nodes[node.id] = node;
    if (edge) {
      //? Add edge to edges map
      edges[edge.id] = edge;
    }

    //? Update all nodes
    const newState = update(state, {
      documents: {
        [id]: {
          nodes: {
            $set: nodes
          },
          edges: { $set: edges }
        }
      },
      currentDoc: {
        activeNodeId: {
          $set: node.id
        }
      }
    });

    setState(newState);
    return node.id;
  },
  updateNodeText: (nodeId, text) => async ({ setState, getState }) => {
    const state = getState();
    const docId = state.currentDoc.id;
    const doc = state.documents[docId];
    const node = doc.nodes[nodeId];

    //? Sync with the server.
    try {
      await API.request(`node/${nodeId}`, "PATCH", {}, { content: text });
    } catch (error) {
      // TODO: do something!
    }

    //? Update state
    const newState = update(state, {
      documents: {
        [docId]: {
          nodes: {
            [nodeId]: {
              content: { $set: text }
            }
          }
        }
      }
    });
    setState(newState);
  },
  setActiveNode: nodeId => ({ setState, getState }) => {
    const state = getState();
    const newState = update(state, {
      currentDoc: {
        activeNodeId: { $set: nodeId }
      }
    });
    setState(newState);
  },
  deleteNode: nodeId => async ({ setState, getState, dispatch }) => {
    const state = getState();
    const docId = state.currentDoc.id;
    const doc = state.documents[docId];

    //? If this is the last node, remove its text.
    if (Object.keys(doc.nodes).length === 1) {
      return dispatch(actions.updateNodeText(nodeId, null));
    }

    //? Determine where to re-focus by finding the edge to this nodes parent.  If the
    //? node has no parent, focus will return to the base node.
    const edge = Object.values(doc.edges).find(({ nodeB }) => nodeB === nodeId);
    const activeNodeId = edge ? edge.nodeA : null;

    try {
      await API.request(`node/${nodeId}`, "DELETE");
    } catch (error) {
      //TODO: something
    }

    // Re-load the document with the updated nodes + edges
    dispatch(
      actions.setActiveDocument(
        doc.humanId,
        activeNodeId,
        state.currentDoc.zoom
      )
    );
  }
};

export default actions;
