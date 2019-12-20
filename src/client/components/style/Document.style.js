import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  //background: conic-gradient(#fff 90deg, #000 2turn);
  height: 100vh;
  width: 100vw;
`;

const Actions = styled.div`
  position: fixed;
  z-index: 99999;
`;

export { Container, Actions };
