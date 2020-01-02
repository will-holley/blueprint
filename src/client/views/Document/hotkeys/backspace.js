import { useHotkeys } from "client/utils/hooks";
import { useCurrentDocument } from "client/data/selectors/document";

/**
 * Delete a node.  Deletes all nodes underneath it.
 */
const useBackspace = () => {
  const [{ activeNodeId }, actions] = useCurrentDocument();
  const handler = () => {
    if (activeNodeId) actions.deleteNode(activeNodeId);
    return false;
  };
  useHotkeys("cmd+backspace", handler, [activeNodeId]);
};

export default useBackspace;
