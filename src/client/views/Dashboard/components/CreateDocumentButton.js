import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { EmojiButton } from "client/components/Buttons";
//* Graphql
import { useMutation, gql } from "@apollo/client";
import { DocumentFragment } from "./../gql";

const CreateDocumentMutation = gql`
  mutation createDocument {
    createDocument(input: {}) {
      document {
        ...DocumentFragment
      }
    }
  }
  ${DocumentFragment}
`;

const CreateDocumentButton = () => {
  const { push } = useHistory();
  const [create] = useMutation(CreateDocumentMutation, {
    onCompleted: ({
      createDocument: {
        document: { humanId }
      }
    }) => push(`d/${humanId}`)
  });
  const [disabled, setDisabled] = useState(false);

  const handleClick = async event => {
    setDisabled(true);
    create();
  };

  return (
    <EmojiButton onClick={handleClick} disabled={disabled}>
      ➕
    </EmojiButton>
  );
};

export default CreateDocumentButton;
