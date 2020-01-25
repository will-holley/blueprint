import { gql } from "@apollo/client";

export const DocumentFragment = gql`
  fragment DocumentFragment on Document {
    id
    name
    humanId
    createdBy
    updatedAt
    private
    createdByUser
  }
`;
