import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  // position: relative;
  // min-height: 100vh;
  // min-width: 100vw;
  // padding: 5vh 5vw 5vh 5vw;
  // height: ${({ height }) => height}px;
  // width: ${({ width }) => width}px;
  //background:linear-gradient(to right, red, red 50%, blue 50%);
  height: 100vh;
  width: 100vw;
`;

const Actions = styled.div`
  position: fixed;
  z-index: 99999;
`;

export { Container, Actions };
