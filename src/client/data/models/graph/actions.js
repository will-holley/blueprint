import update from "immutability-helper";
import {
  createNode,
  repositionNodes,
  createEdge,
  markChildNodesForDeletion
} from "./utils";

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
      [node.id]: {
        $set: node
      }
    });
    // Update all nodes
    let newState = update(state, {
      documents: {
        [document.id]: {
          nodes: {
            $set: repositionNodes(nodes)
          }
        }
      },
      currentDoc: {
        activeNodeId: {
          $set: node.id
        }
      }
    });

    // Create edge if this is not the base node
    if (parentNodeId) {
      const edge = createEdge(parentNodeId, node.id, null);
      newState = update(newState, {
        documents: {
          [document.id]: {
            edges: {
              [edge.id]: { $set: edge }
            },
            nodes: {
              [node.id]: { edges: { [parentNodeId]: { $set: edge.id } } },
              [parentNodeId]: { edges: { [node.id]: { $set: edge.id } } }
            }
          }
        }
      });
    }

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
    const state = getState();
    const document = state.documents[state.currentDoc.id];
    const node = document.nodes[nodeId];

    // Recursively determine which child nodes, if any, need to be deleted
    const { nodesToDelete, edgesToDelete } = markChildNodesForDeletion(
      node,
      document.nodes,
      document.edges
    );

    // Delete nodes & edges
    const edges = update(document.edges, { $unset: edgesToDelete });
    const nodes = update(document.nodes, { $unset: nodesToDelete });

    // Recompute node positions
    const newState = update(state, {
      currentDoc: {
        // If the deleted node has a parent node, focus on it
        activeNodeId: { $set: node.parentId ? node.parentId : null }
      },
      documents: {
        [state.currentDoc.id]: {
          nodes: { $set: nodes.length ? repositionNodes(nodes) : [] },
          edges: { $set: edges }
        }
      }
    });
    setState(newState);
  }
};

export default actions;
