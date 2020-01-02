import { useHotkeys } from "client/utils/hooks";

/**
 * Disable default behaviors.
 */
const useDisableHotkeys = () => {
  useHotkeys("Tab,Shift+Tab,shift+enter", event => {
    return false;
  });
};

export default useDisableHotkeys;
