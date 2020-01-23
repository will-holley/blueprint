//* hooks
import { useHotkeys } from "client/utils/hooks";
//* utils
import { findParentNodeId } from "./utils";

/**
 * Delete a node.  Deletes all nodes underneath it.
 */
const useEnter = (addNode, activeNodeId, edges) => {
  function newBaseNode() {
    if (!activeNodeId) addNode(null);
  }

  function newSiblingNode() {
    if (activeNodeId) {
      const parentId = findParentNodeId(activeNodeId, edges);
      addNode(parentId);
    }
    return false;
  }

  function newChildNode() {
    if (activeNodeId) addNode(activeNodeId);
    return false;
  }

  // Cmd+Enter either creates a new child node if a node isn't currently selected.
  useHotkeys("cmd+enter", newBaseNode, [activeNodeId]);
  useHotkeys("shift+enter", newSiblingNode, [activeNodeId]);
  // If a node is active and user presses enter, create a new child node of the active node.
  useHotkeys("enter,cmd+enter", newChildNode, [activeNodeId]);
};

export default useEnter;
