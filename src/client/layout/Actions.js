import React from "react";
import styled from "styled-components";
import { H3, A } from "client/components/tags";

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

const Link = styled(H3)`
  display: inline-block;
  margin-left: 1rem;
  transition: ease 0.25s;
  &:hover {
    border-bottom: 4px solid;
  }
`;

const ActionDivider = styled(H3)`
  display: inline-block;
  margin-left: 1rem;
`;

const ActionLink = ({ to, children }) => (
  <Link>
    <A to={to}>{children}</A>
  </Link>
);

export { Actions, LeftActions, RightActions, ActionLink, ActionDivider };
