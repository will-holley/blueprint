import { useHotkeys } from "client/utils/hooks";

const useZoom = (zoomIn, zoomOut, resetZoom, currentZoom) => {
  const handleZoomIn = event => {
    event.preventDefault();
    zoomIn();
    return false;
  };

  const handleZoomOut = event => {
    event.preventDefault();
    zoomOut();
    return false;
  };

  const handleZoomReset = event => {
    event.preventDefault();
    resetZoom();
    return false;
  };

  useHotkeys("cmd+=", handleZoomIn, [currentZoom]);
  useHotkeys("cmd+-", handleZoomOut, [currentZoom]);
  useHotkeys("cmd+0", handleZoomReset, [currentZoom]);

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
