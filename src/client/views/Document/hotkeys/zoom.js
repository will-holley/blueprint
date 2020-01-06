//* libraries
import { useSelector, useDispatch } from "react-redux";
//* actions
import {
  zoomIn,
  zoomOut,
  resetZoom
} from "client/data/services/document/actions";
//* everything else
import { useHotkeys } from "client/utils/hooks";

const useZoom = () => {
  const dispatch = useDispatch();
  const { zoom } = useSelector(
    ({
      documents: {
        active: { zoom }
      }
    }) => zoom
  );

  const handleZoomIn = event => {
    event.preventDefault();
    dispatch(zoomIn());
    return false;
  };

  const handleZoomOut = event => {
    event.preventDefault();
    dispatch(zoomOut());
    return false;
  };

  const handleZoomReset = event => {
    event.preventDefault();
    dispatch(resetZoom());
    return false;
  };

  useHotkeys("cmd+=", handleZoomIn, [zoom]);
  useHotkeys("cmd+-", handleZoomOut, [zoom]);
  useHotkeys("cmd+0", handleZoomReset, [zoom]);

  // Block browser zoom.  This gets trigged if cmd is held while switching from
  // plus to minus or visa versa.  Also blocks zoom reset.
  useHotkeys("*", event => {
    if (["-", "=", "0"].includes(event.key) && event.metaKey) {
      event.preventDefault();
      return false;
    }
  });
};

export default useZoom;
