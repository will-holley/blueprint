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
  top: 0;
  left: 0;
  z-index: 99999;
  padding: 1rem;

  h1 {
    font-weight: 800;
    font-size: 18px;
  }
`;

export { Container, Actions };
