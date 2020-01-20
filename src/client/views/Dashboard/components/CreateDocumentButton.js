import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { EmojiButton } from "client/components/Buttons";
import { hri } from "human-readable-ids";
//* Graphql
import { useMutation, gql } from "@apollo/client";

const CreateDocumentMutation = gql`
  mutation createDocument($humanId: String!) {
    createDocument(input: { document: { humanId: $humanId } }) {
      document {
        humanId
      }
    }
  }
`;

const CreateDocumentButton = () => {
  const { push } = useHistory();
  const [create] = useMutation(CreateDocumentMutation, {
    //TODO: The human id assignment should occur in GraphQL middleware.
    variables: { humanId: hri.random() },
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
