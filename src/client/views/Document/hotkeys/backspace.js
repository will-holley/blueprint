import { useHotkeys } from "client/utils/hooks";
import { gql, useMutation } from "@apollo/client";

const DELETE_NODE_MUTATION = gql`
  mutation DeleteNode($nodeId: UUID!) {
    __typename
    deleteNode(input: { nodeId: $nodeId }) {
      clientMutationId
    }
  }
`;

/**
 * Delete a node.  Deletes all nodes underneath it.
 */
const useBackspace = (activeNodeId, refetch) => {
  const [deleteNode] = useMutation(DELETE_NODE_MUTATION, {
    variables: { nodeId: activeNodeId },
    onCompleted: () => refetch()
  });
  const handler = () => {
    if (activeNodeId) deleteNode();
    return false;
  };
  useHotkeys("cmd+backspace", handler, [activeNodeId]);
};

export default useBackspace;
