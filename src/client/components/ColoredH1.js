import styled from "styled-components";
import PropTypes from "prop-types";
// Components
import { H1 } from "client/components/tags";
// Styles
import { randomGradient } from "../styles/gradients";

const ColoredH1 = styled(H1)`
  background: ${randomGradient};
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
  interactive: PropTypes.bool.isRequired
};

ColoredH1.defaultProps = {
  interactive: false
};

export default ColoredH1;
