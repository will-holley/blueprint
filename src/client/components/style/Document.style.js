import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  // position: relative;
  // min-height: 100vh;
  // min-width: 100vw;
  // padding: 5vh 5vw 5vh 5vw;
  // height: ${({ height }) => height}px;
  // width: ${({ width }) => width}px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 5%;
  overflow: scroll;
  //background:linear-gradient(to right, red, red 50%, blue 50%);
`;

const Actions = styled.div``;

export { Container, Actions };
