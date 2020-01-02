import { useHotkeys } from "client/utils/hooks";
import {
  useCurrentDocument,
  findParentNodeId
} from "client/data/selectors/document";

/**
 * Delete a node.  Deletes all nodes underneath it.
 */
const useEnter = () => {
  const [{ activeNodeId }, actions] = useCurrentDocument();

  function newBaseNode() {
    if (!activeNodeId) actions.addNode(null);
  }

  function newSiblingNode() {
    if (activeNodeId) {
      const [parentId] = findParentNodeId();
      actions.addNode(parentId);
    }
    return false;
  }

  function newChildNode() {
    if (activeNodeId) actions.addNode(activeNodeId);
    return false;
  }

  // Cmd+Enter either creates a new child node if a node isn't currently selected.
  useHotkeys("cmd+enter", newBaseNode, [activeNodeId]);
  useHotkeys("cmd+shift+enter", newSiblingNode, [activeNodeId]);
  // If a node is active and user presses enter, create a new child node of the active node.
  useHotkeys("enter,cmd+enter", newChildNode, [activeNodeId]);
};

export default useEnter;
