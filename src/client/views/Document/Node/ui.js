import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.foreignObject`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  cursor: default;
  z-index: 2;
  ${({ dev }) => dev && "border: 1px solid black;"}
`;

Container.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  dev: PropTypes.bool.isRequired
};

const Text = styled.p`
  color: ${({ active, theme }) => (active ? theme.colors.action : "inherit")};
  padding: 1rem 0;
  height: auto;
  width: 100%;
  // * Constrain padding to text to make the entire container clickable.
  text-align: center;
  cursor: ${({ readOnly }) => (readOnly ? "default" : "text")};

  // https://rsms.me/inter/dynmetrics/
  font-size: 15px;
  letter-spacing: -0.00879776em;
  line-height: 21px;

  &:empty:before {
    content: attr(placeholder);
    display: block;
    font-size: 32px;
  }
  &:focus {
    outline: none;
  }
`;

Text.propTypes = {
  active: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired
};

const NewChildButton = styled.a`
  display: block;
  cursor: pointer;
`;

export { Container, Text, NewChildButton };
