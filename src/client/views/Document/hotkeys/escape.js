import { useHotkeys } from "client/utils/hooks";
import { useCurrentDocument } from "client/data/selectors/document";

/**
 * Deactivate all nodes
 */
const useEscape = () => {
  const [, actions] = useCurrentDocument();
  const handler = () => actions.setActiveNode(null);
  useHotkeys("Escape", handler);
};

export default useEscape;
