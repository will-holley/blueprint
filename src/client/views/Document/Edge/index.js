import React from "react";
import PropTypes from "prop-types";
// Components
import { Path } from "./ui";
// Hooks
import { useWindowSize } from "client/utils/hooks";

const Edge = ({
  position: [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x, y }],
  elbow
}) => {
  //? Create a bezier curve.
  const bezier = `M ${x1} ${y1} C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
  //? Create a straight line.
  const straight = `M ${x1} ${y1} L ${x} ${y}`;
  return <Path d={elbow ? bezier : straight} />;
};

Edge.propTypes = {
  position: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  elbow: PropTypes.bool.isRequired
};
Edge.defaultProps = {
  elbow: true
};

export default Edge;
