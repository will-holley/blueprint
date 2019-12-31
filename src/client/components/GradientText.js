import styled from "styled-components";
import PropTypes from "prop-types";
// Styles
import { getRandomGradient } from "../styles/gradients";

const gradient = getRandomGradient();
const GradientText = styled.span`
  background: ${({ dynamic }) => (dynamic ? getRandomGradient() : gradient)};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &:hover {
    // color: ${({ theme }) => theme.color};
    // -webkit-text-fill-color: unset;
    ${({ interactive }) =>
      interactive &&
      `
      opacity: 0.7;
    `}
  }
`;

GradientText.propTypes = {
  interactive: PropTypes.bool.isRequired,
  dynamic: PropTypes.bool.isRequired
};

GradientText.defaultProps = {
  interactive: false,
  dynamic: false
};

export default GradientText;
