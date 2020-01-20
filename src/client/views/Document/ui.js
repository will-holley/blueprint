import React from "react";
import styled from "styled-components";
import { Actions } from "client/components/Actions";

/**
 * Memoize so pixels is not being recomputed every time an updated
 * is made to the parent document.
 */
const DocumentName = React.memo(styled.input`
  display: inline-block;
  font-weight: 800;
  font-size: 2rem;
  letter-spacing: -0.03em;
  padding-left: 0.5rem;
  border: 0;
  border-bottom: 1px dashed #e2e2e2;
  background: transparent;
  width: ${({ value }) => {
    const pixels = value.length * 15;
    return `${pixels}px`;
  }};
  &:focus {
    outline: none;
  }
  &:disabled {
    border-bottom: 0;
    cursor: default;
  }
`);

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

export { DocumentName, HotkeyShortcutsContainer };
