import { stratify } from "d3-hierarchy"; // https://github.com/d3/d3-hierarchy#hierarchy
import { flextree } from "d3-flextree"; // https://github.com/Klortho/d3-flextree
import { calculateNodeHeight } from "./utils";

/**
 * Assigns hierarchical x/y coordinates to nodes
 */
const computeNodePositions = nodes => {
  const baseNode = stratify()(nodes);

  //* Use the flextree for now...
  const layout = flextree({
    // Determines how far adjacent nodes in that diagram should appear
    spacing: 300,
    nodeSize: ({ data: { id } }) => [300, calculateNodeHeight(id)]
  });

  // Get positions
  const data = layout(baseNode);

  // Return all nodes
  return data.descendants();
};

/**
 * Repositions all nodes, handling conversion from an object to an
 * array and back again.
 */
const renderTree = (nodes, edges) => {
  const _nodes = nodes;
  //? Iterate through each of the edges and add parent/child associations
  //? to the nodes. `parentId` is required for the current layout engine.
  Object.values(edges).forEach(({ nodeA, nodeB, hasParent }) => {
    //? There are currently no peer edges so `hasParent` should always be true.
    //? The current layout engine also does not support horizontal hierarchy.
    _nodes[nodeB].parentId = !hasParent ? null : nodeA;
  });

  const asArray = Object.values(_nodes);
  computeNodePositions(asArray).forEach(node => {
    // Add position to this node
    _nodes[node.id].position = { x: node.x, y: node.y };
    // Add depth to this node
    _nodes[node.id].depth = node.depth;
  });
  return _nodes;
};

export default renderTree;
