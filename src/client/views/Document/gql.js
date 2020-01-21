import { gql } from "@apollo/client";

const EdgeFragment = gql`
  fragment EdgeFragment on Edge {
    id
    nodeA
    nodeB
    hasParent
  }
`;

const NodeFragment = gql`
  fragment NodeFragment on _Node {
    id
    humanId
    content
    contentType
    createdAt
    edgesByNodeA {
      nodes {
        ...EdgeFragment
      }
    }
    edgesByNodeB {
      nodes {
        ...EdgeFragment
      }
    }
  }
  ${EdgeFragment}
`;

const DocumentQuery = gql`
  query DocumentQuery($id: String!) {
    documentByHumanId(humanId: $id) {
      id
      name
      createdByUser
      private
      _nodes {
        ...NodeFragment
      }
    }
  }
  ${NodeFragment}
`;

const CREATE_NODE_MUTATION = gql`
  mutation CreateNode($parentNodeId: UUID, $documentId: UUID!) {
    createNode(
      input: {
        _node: {
          document: $documentId
          edgesToNodeBUsingId: {
            create: { nodeA: $parentNodeId, hasParent: true }
          }
        }
      }
    ) {
      _node {
        ...NodeFragment
      }
      __typename
    }
  }
  ${NodeFragment}
`;

const CREATE_BASE_NODE_MUTATION = gql`
  mutation CreateNode($documentId: UUID!) {
    createNode(input: { _node: { document: $documentId } }) {
      _node {
        ...NodeFragment
      }
      __typename
    }
  }
  ${NodeFragment}
`;

export { DocumentQuery, CREATE_NODE_MUTATION, CREATE_BASE_NODE_MUTATION };
