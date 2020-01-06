//* libraries
import { useSelector, useDispatch } from "react-redux";
//* selectors
import { activeDocumentSelector } from "client/data/selectors/document";
//* actions
import { addNode } from "client/data/services/document/actions";
//* hooks
import { useHotkeys } from "client/utils/hooks";
//* utils
import { findParentNodeId } from "./utils";

/**
 * Delete a node.  Deletes all nodes underneath it.
 */
const useEnter = () => {
  const { activeNodeId, edges } = useSelector(activeDocumentSelector);
  const dispatch = useDispatch();

  function newBaseNode() {
    if (!activeNodeId) dispatch(addNode(null));
  }

  function newSiblingNode() {
    if (activeNodeId) {
      const parentId = findParentNodeId(activeNodeId, edges);
      dispatch(addNode(parentId));
    }
    return false;
  }

  function newChildNode() {
    if (activeNodeId) dispatch(addNode(activeNodeId));
    return false;
  }

  // Cmd+Enter either creates a new child node if a node isn't currently selected.
  useHotkeys("cmd+enter", newBaseNode, [activeNodeId]);
  useHotkeys("cmd+shift+enter", newSiblingNode, [activeNodeId]);
  // If a node is active and user presses enter, create a new child node of the active node.
  useHotkeys("enter,cmd+enter", newChildNode, [activeNodeId]);
};

export default useEnter;
