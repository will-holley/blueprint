import update from "immutability-helper";

import {
  POPULATE_DOCUMENTS,
  SET_ACTIVE_DOCUMENT,
  UNSET_ACTIVE_DOCUMENT,
  CREATE_DOCUMENT,
  UPDATE_DOCUMENT_NAME,
  ZOOM_IN,
  ZOOM_OUT,
  RESET_ZOOM,
  ADD_NODE,
  UPDATE_NODE_CONTENT,
  SET_ACTIVE_NODE,
  DELETE_NODE,
  CHANGE_SPOTLIGHT_VISIBILITY,
  UPDATE_DOCUMENT_PRIVACY,
  DELETE_DOCUMENT
} from "./constants";

const initialState = {
  all: {},
  active: {
    id: null,
    dimensions: {
      height: window.innerHeight,
      width: window.innerWidth
    },
    // 1 by default
    zoom: 1,
    // Hotkeys, etc.
    activeNodeId: null,
    // spotlight status
    spotlightVisible: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POPULATE_DOCUMENTS: {
      return update(state, {
        all: { $set: action.documents }
      });
    }
    case SET_ACTIVE_DOCUMENT: {
      return update(state, {
        active: {
          id: { $set: action.id },
          activeNodeId: { $set: action.activeNodeId }
        },
        all: {
          [action.id]: {
            nodes: { $set: action.nodes },
            edges: { $set: action.edges }
          }
        }
      });
    }
    case UNSET_ACTIVE_DOCUMENT: {
      return update(state, {
        active: { $set: initialState.active }
      });
    }
    case CREATE_DOCUMENT: {
      return update(state, {
        all: {
          [action.document.id]: { $set: action.document }
        }
      });
    }
    case UPDATE_DOCUMENT_NAME: {
      return update(state, {
        all: {
          [action.docId]: {
            name: { $set: action.name }
          }
        }
      });
    }
    case UPDATE_DOCUMENT_PRIVACY: {
      return update(state, {
        all: {
          [action.docId]: {
            private: { $set: action.private }
          }
        }
      });
    }
    case DELETE_DOCUMENT: {
      //! Currently assumes docId is active
      return update(state, {
        all: {
          $unset: [action.docId]
        },
        active: { $set: initialState.active }
      });
    }
    case ZOOM_IN: {
      return update(state, {
        active: {
          zoom: { $set: state.active.zoom + 0.1 }
        }
      });
    }
    case ZOOM_OUT: {
      return update(state, {
        active: {
          zoom: { $set: state.active.zoom - 0.1 }
        }
      });
    }
    case RESET_ZOOM: {
      return update(state, {
        active: {
          zoom: { $set: initialState.active.zoom }
        }
      });
    }
    case ADD_NODE: {
      const { node, edge } = action;
      const activeDocId = state.active.id;
      let newState = update(state, {
        active: {
          activeNodeId: { $set: node.id }
        },
        all: {
          [activeDocId]: {
            nodes: {
              [node.id]: { $set: node }
            }
          }
        }
      });
      if (edge) {
        newState = update(newState, {
          all: {
            [activeDocId]: {
              edges: {
                [edge.id]: { $set: edge }
              }
            }
          }
        });
      }
      return newState;
    }
    case UPDATE_NODE_CONTENT: {
      return update(state, {
        all: {
          [state.active.id]: {
            nodes: {
              [state.active.activeNodeId]: {
                content: { $set: action.content }
              }
            }
          }
        }
      });
    }
    case SET_ACTIVE_NODE: {
      return update(state, {
        active: {
          activeNodeId: { $set: action.nodeId }
        }
      });
    }
    case DELETE_NODE: {
      //! this allows the deletion of last nodes!
      //? Determine where to re-focus by finding the edge to this nodes parent.  If the
      //? node has no parent, focus will return to the base node.
      const edges = state.all[state.active.id].edges;
      const edge = Object.values(edges).find(
        ({ nodeB }) => nodeB === action.nodeId
      );

      return update(state, {
        all: {
          [state.active.id]: {
            nodes: { $unset: action.nodesToDelete },
            edges: { $unset: action.edgesToDelete }
          }
        },
        active: {
          activeNodeId: { $set: edge ? edge.nodeA : null }
        }
      });
    }
    case CHANGE_SPOTLIGHT_VISIBILITY: {
      return update(state, {
        active: {
          spotlightVisible: { $set: !state.active.spotlightVisible }
        }
      });
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };
