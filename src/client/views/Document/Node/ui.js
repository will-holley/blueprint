import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.foreignObject`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  cursor: default;
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
  color: ${({ active }) => (active ? "#1976D2" : "inherit")};
  padding: 2rem 0.75rem;
  height: auto;
  width: 100%;
  // * Constrain padding to text to make the entire container clickable.
  font-size: 26px;
  font-weight: bold;
  line-height: 1.25;
  text-align: center;
  cursor: text;
  &:empty:before {
    content: attr(placeholder);
    display: block;
    font-size: 26px;
  }
  &:focus {
    outline: none;
  }
`;

Text.propTypes = {
  active: PropTypes.bool.isRequired
};

const NewChildButton = styled.a`
  display: block;
  cursor: pointer;
`;

export { Container, Text, NewChildButton };
