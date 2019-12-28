import styled from "styled-components";

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

export { Actions, LeftActions, RightActions };
