import styled from "styled-components";
import PropTypes from "prop-types";
// Components
import { H1 } from "client/components/tags";
// Styles
import { getRandomGradient } from "../styles/gradients";

const ColoredH1 = styled(H1)`
  background: ${({ gradient }) => (gradient ? gradient : getRandomGradient())};
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

ColoredH1.propTypes = {
  interactive: PropTypes.bool.isRequired,
  gradient: PropTypes.string
};

ColoredH1.defaultProps = {
  interactive: false,
  gradient: null
};

export default ColoredH1;
