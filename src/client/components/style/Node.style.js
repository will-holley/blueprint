import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.foreignObject`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  //border: 1px solid black;
`;

Container.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired
};

const Text = styled.p`
  height: auto;
  width: ${({ width }) => width}px;
  // * Constrain padding to text to make the entire container clickable.
  font-size: 26px;
  line-height: 26px;
  text-align: center;
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
  width: PropTypes.number.isRequired
};

const NewChildButton = styled.a``;

export { Container, Text, NewChildButton };
