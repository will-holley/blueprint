import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  // DEV:
  //background: conic-gradient(#fff 90deg, #000 2turn);
`;

const Actions = styled.div`
  position: fixed;
  top: 0;
  z-index: 99999;
  padding: 1rem;
`;

const LeftActions = styled(Actions)`
  left: 0;
`;
const RightActions = styled(Actions)`
  right: 0;
`;

const Title = styled.h1`
  display: inline-block;
  font-weight: 800;
  font-size: 18px;
`;

const ActionInfo = styled(Actions)`
  top: unset;
  bottom: 0;
  right: 0;
`;

const HotkeyShortcutsContainer = styled(ActionInfo)`
  width: 400px;
  h2 {
    padding: 0.5rem;
    font-weight: 300;
  }
  div {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #e2e2e2;
    code {
      font-family: monospace;
      width: 50%;
      display: inline-block;
    }
    span {
      width: 50%;
    }
  }
`;

export {
  Container,
  LeftActions,
  RightActions,
  Title,
  HotkeyShortcutsContainer
};
