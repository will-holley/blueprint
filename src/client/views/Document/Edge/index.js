//* Libraries
import React from "react";
import PropTypes from "prop-types";
//* Components
import { Path } from "./ui";
//* Hooks
import { useWindowSize } from "client/utils/hooks";

const Edge = ({ position: [{ x: x1, y: y1 }, { x: x2, y: y2 }], id }) => (
  <Path d={`M ${x1} ${y1} L ${x2} ${y2}`} id={id} />
);

Edge.propTypes = {
  position: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  id: PropTypes.string.isRequired
};

export default Edge;
