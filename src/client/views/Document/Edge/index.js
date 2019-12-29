import React from "react";
import PropTypes from "prop-types";
// Data
import useStore from "client/data/store";
// Hooks
import { useWindowSize } from "client/utils/hooks";
// Components
import { Path } from "./ui";
// Utils
import { calibratePosition, yBottomPadding } from "./../utils";

const Edge = ({ id, humanId, nodeAId, nodeBId }) => {
  const [state, actions] = useStore();

  const { nodes } = state.documents[state.currentDoc.id];

  //! Get current window position.  Why use the hook?  Because it handles
  //! resizing!
  const { height: windowHeight, width: windowWidth } = useWindowSize();

  //! Compute Node A Position
  const {
    position: { y: aY, x: aX },
    dimensions: { width: aWidth, height: aHeight }
  } = nodes[nodeAId];

  const calibratedAX = calibratePosition(aX, windowWidth, aWidth);
  const calibratedAY = calibratePosition(aY, windowHeight, aHeight);

  //! Compute Node B position
  const {
    position: { y: bY, x: bX },
    dimensions: { width: bWidth, height: bHeight },
    depth: bDepth
  } = nodes[nodeBId];

  const calibratedBX = calibratePosition(bX, windowWidth, bWidth);
  const calibratedBY = calibratePosition(bY, windowHeight, bHeight);

  // console.log({
  //   calibratedAY,
  //   aHeight,
  //   calibratedBY,
  //   bHeight
  // });

  //! Compute Edge position
  const d = [
    "M",
    calibratedAX + aWidth / 2,
    calibratedAY + aHeight + yBottomPadding * (bDepth - 1),
    "L",
    calibratedBX + bWidth / 2,
    calibratedBY
  ];
  return <Path id={humanId} d={d.join(" ")} />;
};

Edge.propTypes = {
  id: PropTypes.string.isRequired,
  humanId: PropTypes.string.isRequired,
  nodeAId: PropTypes.string.isRequired,
  nodeBId: PropTypes.string.isRequired
};
Edge.defaultProps = {};

export default Edge;
