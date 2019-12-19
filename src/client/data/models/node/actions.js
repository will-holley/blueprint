import update from "immutability-helper";
import { createNode, repositionNodes } from "./utils";

const actions = {
  /**
   * Adds a new node to document
   */
  addNode: parentNodeId => ({ setState, getState }) => {
    const state = getState();
    const document = state.documents[state.currentDoc.id];
    // Create default node and add it to nodes before update
    // nodes positions
    const node = createNode(parentNodeId);
    const nodes = update(document.nodes, {
      [node.id]: { $set: node }
    });
    // Update all nodes
    const newState = update(state, {
      documents: {
        [document.id]: {
          nodes: { $set: repositionNodes(nodes) }
        }
      },
      currentDoc: {
        activeNodeId: {
          $set: node.id
        }
      }
    });
    setState(newState);
  },
  updateNodeText: (nodeId, text, nodeHeight) => ({ setState, getState }) => {
    const state = getState();
    // Update Content
    let newState = update(state, {
      documents: {
        [state.currentDoc.id]: {
          nodes: {
            [nodeId]: {
              content: {
                text: { $set: text },
                type: { $set: "text" }
              }
            }
          }
        }
      }
    });
    if (nodeHeight) {
      // Update height then re-compute all positions.
      const nodes = update(state.documents[state.currentDoc.id].nodes, {
        [nodeId]: {
          dimensions: {
            height: {
              $set: nodeHeight
            }
          }
        }
      });
      const repositioned = repositionNodes(nodes);
      newState = update(newState, {
        documents: {
          [state.currentDoc.id]: {
            nodes: { $set: repositioned }
          }
        }
      });
    }
    setState(newState);
  },
  /**
   * Called immediately after a node is mounted
   */
  updateNodeHeight: (nodeId, nodeHeight) => ({ setState, getState }) => {
    const state = getState();
    const newState = update(state, {
      documents: {
        [state.currentDoc.id]: {
          nodes: {
            [nodeId]: {
              dimensions: {
                height: { $set: nodeHeight }
              }
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
  deleteNode: nodeId => ({ setState, getState }) => {
    // TODO: think about this. Write and delete edges?
  }
};

export default actions;
