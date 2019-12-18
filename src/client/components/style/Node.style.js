import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  height: auto;
  width: ${({ width }) => width}px;
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
`;

Container.propTypes = {
  width: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired
};

const Text = styled.p`
  height: auto;
  width: ${({ width }) => width}px;
  // * Constrain padding to text to make the entire container clickable.
  font-size: 22px;
`;

Text.propTypes = {
  width: PropTypes.number.isRequired
};

const NewChildButton = styled.button`
  position: absolute;
  font-size: 26px;
  background: transparent;
  border: none;
  right: -2.5rem;
  top: -2.75rem;
`;

export { Container, Text, NewChildButton };
