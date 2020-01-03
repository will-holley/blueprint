import styled from "styled-components";
import PropTypes from "prop-types";
import { animated } from "react-spring";

const Path = styled(animated.path)`
  fill: transparent;
  stroke: #e2e2e2;
  stroke-width: 1pt;
  stroke-dasharray: 5, 5;
  stroke-linecap: round;
  z-index: 1;
`;

Path.propTypes = {};

export { Path };
