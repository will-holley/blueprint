import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// Data
import useStore from "client/data/store";
// Components
import { RightActions } from "client/containers/Content/Actions";
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
      <EmojiButton onClick={createDocument} disabled={disabled}>
        🌀
      </EmojiButton>
    </RightActions>
  );
};

export default Actions;
