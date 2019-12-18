import update from "immutability-helper";
import { createNode, computeNodePositions } from "./utils";

const actions = {
  /**
   * Adds a new node to document
   */
  addNode: parentNodeId => ({ setState, getState }) => {
    const state = getState();
    const document = state.documents[state.currentDoc.id];
    // Create default node
    const node = createNode(parentNodeId);
    const nodes = document.nodes;
    nodes[node.id] = node;
    // Update positions and set back onto dict
    computeNodePositions(Object.values(nodes)).forEach(node => {
      nodes[node.id].position = {
        x: node.x,
        y: node.y
      };
    });
    // Update all nodes
    const newState = update(state, {
      documents: {
        [document.id]: {
          nodes: { $set: nodes }
        }
      },
      currentDoc: {
        activeNode: {
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
    // If height has changed, update height
    if (nodeHeight) {
      newState = update(newState, {
        documents: {
          [state.currentDoc.id]: {
            nodes: {
              [nodeId]: {
                dimensions: {
                  height: {
                    $set: nodeHeight
                  }
                }
              }
            }
          }
        }
      });
    }
    setState(newState);
  },
  setAsFocused: nodeId => ({ setState, getState }) => {
    console.log(nodeId);
    const state = getState();
    const newState = update(state, {
      currentDoc: {
        activeNode: { $set: nodeId }
      }
    });
    setState(newState);
  }
};

export default actions;
