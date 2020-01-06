//* libraries
import { useSelector, useDispatch } from "react-redux";
//* actions
import { deleteNode } from "client/data/services/document/actions";
//* hooks
import { useHotkeys } from "client/utils/hooks";
//* selectors
import { activeDocumentSelector } from "client/data/selectors/document";

/**
 * Delete a node.  Deletes all nodes underneath it.
 */
const useBackspace = () => {
  const dispatch = useDispatch();
  const { activeNodeId } = useSelector(activeDocumentSelector);
  const handler = () => {
    if (activeNodeId) dispatch(deleteNode(activeNodeId));
    return false;
  };
  useHotkeys("cmd+backspace", handler, [activeNodeId]);
};

export default useBackspace;
