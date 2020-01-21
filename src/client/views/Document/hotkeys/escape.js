//* hooks
import { useHotkeys } from "client/utils/hooks";

/**
 * Deactivate all nodes
 */
const useEscape = setActiveNodeId => {
  const handler = event => setActiveNodeId(null);
  useHotkeys("Escape", handler);
};

export default useEscape;
