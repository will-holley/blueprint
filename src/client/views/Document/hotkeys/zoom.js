import { useHotkeys } from "client/utils/hooks";
import { useCurrentDocument } from "client/data/selectors/document";

const useZoom = () => {
  const [{ zoom }, actions] = useCurrentDocument();

  const handleZoomIn = event => {
    actions.zoomIn();
    return false;
  };

  const handleZoomOut = event => {
    actions.zoomOut();
    return false;
  };

  useHotkeys("cmd+=", handleZoomIn, [zoom]);
  useHotkeys("cmd+-", handleZoomOut, [zoom]);
};

export default useZoom;
