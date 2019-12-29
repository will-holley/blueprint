import React from "react";
import PropTypes from "prop-types";
// Components
import { Path } from "./ui";
// Hooks
import { useWindowSize } from "client/utils/hooks";

const Edge = ({ id, humanId, nodeAId, nodeBId }) => {
  //? Re-render the edge when the window resizes or when nodes update
  const _ = useWindowSize();

  //? Get references to the nodes
  const nodeAEl = document.getElementById(nodeAId);
  const nodeBEl = document.getElementById(nodeBId);

  if (nodeAEl && nodeBEl) {
    const [aX, aY] = nodeAEl.dataset.edgeExit.split(",");
    const [bX, bY] = nodeBEl.dataset.edgeEnter.split(",");
    const d = ["M", aX, aY, "L", bX, bY].join(" ");
    console.log(d);
    return <Path id={humanId} d={d} />;
  } else {
    return <></>;
  }
};

Edge.propTypes = {
  id: PropTypes.string.isRequired,
  humanId: PropTypes.string.isRequired,
  nodeAId: PropTypes.string.isRequired,
  nodeBId: PropTypes.string.isRequired
};
Edge.defaultProps = {};

export default Edge;
