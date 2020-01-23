/**
 * Given an active node, finds the id of the parent node.
 */
const findParentNodeId = (activeNodeId, edges) => {
  //? Find the parent id
  const edge = edges.find(({ nodeB }) => nodeB === activeNodeId);
  return edge ? edge.nodeA : null;
};

export { findParentNodeId };
