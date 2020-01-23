//* Libraries
//* API
import { requestFailed } from "client/data/services/api/actions";
import API from "../../../graphql/api";
//* Constants
import {
  ADD_NODE,
  CREATE_DOCUMENT,
  DELETE_NODE,
  POPULATE_DOCUMENTS,
  RESET_ZOOM,
  SET_ACTIVE_DOCUMENT,
  SET_ACTIVE_NODE,
  UNSET_ACTIVE_DOCUMENT,
  UPDATE_DOCUMENT_NAME,
  UPDATE_NODE_CONTENT,
  ZOOM_IN,
  ZOOM_OUT,
  CHANGE_SPOTLIGHT_VISIBILITY,
  UPDATE_DOCUMENT_PRIVACY,
  DELETE_DOCUMENT,
  DUPLICATE_DOCUMENT
} from "./constants";

export const updateDocumentName = name => async (dispatch, getState) => {
  const {
    documents: {
      active: { id: docId }
    }
  } = getState();

  try {
    if (name !== "") {
      //? If the user deletes the full text, do not save to the database
      await API.request(`document/${docId}`, "PUT", {}, { name });
    }
    return dispatch({
      type: UPDATE_DOCUMENT_NAME,
      docId,
      name
    });
  } catch (error) {
    return requestFailed(error);
  }
};

export const populateAllDocuments = () => async dispatch => {
  // TODO: search + pagination + caching
  try {
    const response = await API.request("document", "GET");
    return dispatch({
      type: POPULATE_DOCUMENTS,
      documents: response
    });
  } catch (error) {
    return requestFailed(error);
  }
};

/**
 * Lookup the document id corresponding to this humanId and load
 * all nodes for that document if they have not yet been loaded.
 * Nodes are not loaded by default when documents are populated.
 * @param {string} humanId : the human id of this doc
 * @param {string} activeNodeId : the node which should be active when the doc re-renders
 */
export const setActiveDocument = (humanId, activeNodeId = undefined) => async (
  dispatch,
  getState
) => {
  //? Check if active doc is being unset
  if (!humanId) {
    return dispatch({
      type: UNSET_ACTIVE_DOCUMENT
    });
  }

  //? Look up the id which corresponds to this human id
  const { documents } = getState();
  const result = Object.entries(documents.all).find(
    ([id, doc]) => doc.humanId === humanId
  );
  if (!result) return dispatch(push("/"));
  const [id, _] = result;

  //? Query document details
  let nodes, edges;
  try {
    //TODO: determine when these should be cached
    const response = await API.request(`document/${id}`, "GET");
    if (response.error) {
      return requestFailed(response.error);
    }
    nodes = response.nodes;
    edges = response.edges;
  } catch (error) {
    return requestFailed(error);
  }

  //? Make the base node the active node
  const baseNode = Object.values(nodes).find(({ isBase }) => isBase);

  return dispatch({
    type: SET_ACTIVE_DOCUMENT,
    id,
    activeNodeId: activeNodeId ? activeNodeId : baseNode ? baseNode.id : null,
    nodes,
    edges
  });
};

export const zoomIn = () => ({ type: ZOOM_IN });

export const zoomOut = () => ({ type: ZOOM_OUT });

export const resetZoom = () => ({ type: RESET_ZOOM });

export const createDocument = () => async dispatch => {
  try {
    const document = await API.request("document", "POST");
    dispatch({ type: CREATE_DOCUMENT, document });
    return document.humanId;
  } catch (error) {
    return requestFailed(error);
  }
};

//! ==================
//! == Node Actions ==
//! ==================

/**
 * Adds a new node to document
 */
export const addNode = parentNodeId => async (dispatch, getState) => {
  const {
    documents: {
      active: { id }
    }
  } = getState();

  //? Create default node and add it to nodes before update nodes positions
  try {
    const [node, edge] = await API.request(
      "node",
      "POST",
      {},
      {
        documentId: id,
        parentNodeId: parentNodeId
      }
    );
    dispatch({ type: ADD_NODE, node, edge });
    return node.id;
  } catch (error) {
    return requestFailed(error);
  }
};

export const updateNodeText = (nodeId, text) => async dispatch => {
  try {
    await API.request(`node/${nodeId}`, "PATCH", {}, { content: text });
    dispatch({ type: UPDATE_NODE_CONTENT, content: text });
  } catch (error) {
    return requestFailed(error);
  }
};

export const setActiveNode = nodeId => ({
  type: SET_ACTIVE_NODE,
  nodeId
});

export const deleteNode = nodeId => async dispatch => {
  try {
    const { nodeIds, edgeIds } = await API.request(`node/${nodeId}`, "DELETE");
    return dispatch({
      type: DELETE_NODE,
      nodeId,
      nodesToDelete: nodeIds,
      edgesToDelete: edgeIds
    });
  } catch (error) {
    console.error(error);
    return requestFailed(error);
  }
};

export const changeSpotlightVisibility = () => ({
  type: CHANGE_SPOTLIGHT_VISIBILITY
});

export const updateDocumentPrivacy = () => async (dispatch, getState) => {
  const {
    documents: {
      active: { id: docId },
      all
    }
  } = getState();

  const { private: _private } = all[docId];
  const updatedPrivacy = !_private;

  try {
    //? If the user deletes the full text, do not save to the database
    await API.request(
      `document/${docId}`,
      "PUT",
      {},
      { private: updatedPrivacy }
    );
    return dispatch({
      type: UPDATE_DOCUMENT_PRIVACY,
      docId,
      private: updatedPrivacy
    });
  } catch (error) {
    return requestFailed(error);
  }
};

export const deleteDocument = () => async (dispatch, getState) => {
  const {
    documents: {
      active: { id: docId }
    }
  } = getState();

  try {
    //? If the user deletes the full text, do not save to the database
    await API.request(`document/${docId}`, "DELETE");
    return dispatch({ type: DELETE_DOCUMENT, docId });
  } catch (error) {
    return requestFailed(error);
  }
};

export const duplicateDocument = () => async (dispatch, getState) => {
  const {
    documents: {
      active: { id: docId }
    }
  } = getState();

  try {
    //? If the user deletes the full text, do not save to the database
    const document = await API.request(`document/${docId}/duplicate`, "POST");
    dispatch({ type: DUPLICATE_DOCUMENT, duplicate: document });
    return document.humanId;
  } catch (error) {
    return requestFailed(error);
  }
};
