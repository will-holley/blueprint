//* libraries
import { useDispatch } from "react-redux";
//* hooks
import { useHotkeys } from "client/utils/hooks";
//* actions
import { setActiveNode } from "client/data/services/document/actions";

/**
 * Deactivate all nodes
 */
const useEscape = () => {
  const dispatch = useDispatch();
  const handler = () => dispatch(setActiveNode(null));
  useHotkeys("Escape", handler);
};

export default useEscape;
