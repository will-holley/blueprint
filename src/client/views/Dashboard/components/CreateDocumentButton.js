import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { EmojiButton } from "client/components/Buttons";
//* Graphql
import { useMutation, gql } from "@apollo/client";
import { DocumentFragment } from "./../gql";
import { CREATE_BASE_NODE_MUTATION } from "client/views/Document/gql";

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
  const [createDocument] = useMutation(CreateDocumentMutation);
  const [createBaseNode] = useMutation(CREATE_BASE_NODE_MUTATION);
  const [disabled, setDisabled] = useState(false);

  const handleClick = async event => {
    setDisabled(true);
    const result = await createDocument();
    const { id, humanId } = result.data.createDocument.document;
    await createBaseNode({
      variables: {
        documentId: id
      }
    });
    push(`d/${humanId}`);
  };

  return (
    <EmojiButton onClick={handleClick} disabled={disabled}>
      ➕
    </EmojiButton>
  );
};

export default CreateDocumentButton;
