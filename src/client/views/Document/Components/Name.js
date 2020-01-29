import React from "react";
import PropTypes from "prop-types";
import { DebounceInput } from "react-debounce-input";
import styled from "styled-components";
//* Graphql
import { gql, useMutation } from "@apollo/client";

// =============================
// == Presentation Components ==
// =============================
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
  background: transparent;
  width: ${({ value }) => {
    const pixels = value.length * 10;
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

// ===============
// == Mutations ==
// ===============

const UPDATE_NAME_MUTATION = gql`
  mutation UpdateDocumentPrivacy($id: UUID!, $name: String!) {
    __typename
    updateDocument(input: { patch: { name: $name }, id: $id }) {
      document {
        id
        name
      }
    }
  }
`;

// ===============
// == Component ==
// ===============

const Name = ({ editable, text, documentId }) => {
  const [setName] = useMutation(UPDATE_NAME_MUTATION);
  const handleNameChange = ({ target: { value } }) => {
    setName({ variables: { id: documentId, name: value } });
  };

  return (
    <DebounceInput
      element={DocumentName}
      disabled={!editable}
      value={text}
      onChange={handleNameChange}
      debounceTimeout={600}
    />
  );
};

Name.propTypes = {
  editable: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired
};

export default Name;
