import PropTypes from "prop-types";
import styled from "styled-components";
import { Actions } from "client/containers/Content/Actions";

const Title = styled.input`
  display: inline-block;
  font-weight: 800;
  font-size: 18px;
  text-align: center;
  border: 0;
  border-bottom: 1px dashed #e2e2e2;
  &:focus {
    outline: none;
  }
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

export { Title, HotkeyShortcutsContainer };
