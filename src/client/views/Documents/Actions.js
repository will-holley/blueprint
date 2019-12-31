import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// Data
import useStore from "client/data/store";
// Components
import { RightActions, ActionLink, ActionDivider } from "client/layout/Actions";
import { EmojiButton } from "client/components/Buttons";

const Actions = () => {
  const [state, actions] = useStore();
  const [disabled, setDisabled] = useState(false);
  const { push } = useHistory();

  const createDocument = async () => {
    setDisabled(true);
    const humanId = await actions.createDocument();
    push(`d/${humanId}`);
  };

  return (
    <RightActions>
      {state.user ? (
        <EmojiButton onClick={createDocument} disabled={disabled}>
          ➕
        </EmojiButton>
      ) : (
        <>
          <ActionLink to="/join">Join</ActionLink>
          <ActionDivider>or</ActionDivider>
          <ActionLink to="/login">Login</ActionLink>
        </>
      )}
    </RightActions>
  );
};

export default Actions;
