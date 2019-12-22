import styled from "styled-components";
import PropTypes from "prop-types";

const Edge = styled.path`
  fill: transparent;
  stroke: #e2e2e2;
  stroke-width: 1pt;
  stroke-dasharray: 5, 5;
  stroke-linecap: round;
`;

Edge.propTypes = {
  id: PropTypes.string.isRequired
};

export { Edge };
