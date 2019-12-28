import uuidv4 from "uuid/v4";
import { hri } from "human-readable-ids";
import { stratify } from "d3-hierarchy"; // https://github.com/d3/d3-hierarchy#hierarchy
import { flextree } from "d3-flextree"; // https://github.com/Klortho/d3-flextree

const DEFAULT_WIDTH = 300;
const NODE_SPACING = DEFAULT_WIDTH;

const createNode = parentId => ({
  _id: uuidv4(),
  id: hri.random(),
  parentId,
  position: {
    x: null,
    y: null
  },
  dimensions: {
    // After the node mounts, height is set dynamically set as the aggregate of child
    // component heights.
    height: 0,
    width: DEFAULT_WIDTH
  },
  content: {
    type: null,
    text: null
  },
  draggable: true,
  edges: {},
  depth: undefined
});

/**
 * An edge can either be a parent-child relationship or a
 * peer relationship.
 * @param parent  parent node id
 * @param child   child node id
 * @param peers   array of node ids
 */
const createEdge = (parent, child, peers) => ({
  _id: uuidv4(),
  id: hri.random(),
  parent: parent ? parent : null,
  child: child ? child : null,
  peers: peers
    ? peers.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {})
    : null
});

/**
 * Assigns hierarchical x/y coordinates to nodes
 */
const computeNodePositions = nodes => {
  const baseNode = stratify()(nodes);

  //* Use the flextree for now...
  const layout = flextree({
    // Determines how far adjacent nodes in that diagram should appear
    spacing: DEFAULT_WIDTH,
    nodeSize: ({ data: { id, dimensions } }) => [
      dimensions.width,
      dimensions.height
    ]
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
const repositionNodes = nodes => {
  const _nodes = nodes;
  const asArray = Object.values(_nodes);
  computeNodePositions(asArray).forEach(node => {
    // Add position to this node
    _nodes[node.id].position = { x: node.x, y: node.y };
    // Add depth to this node
    _nodes[node.id].depth = node.depth;
  });
  return _nodes;
};

/**
 * Given a base node, find the node ids of all nodes underneath it and return
 * those along with the edge ids linking said nodes.
 * @param baseNodeId
 * @param nodes
 * @param edges
 */
const markChildNodesForDeletion = (baseNode, nodes, edges) => {
  // By design the given node is to be deleted.
  const nodesToDelete = [baseNode.id];
  const edgesToDelete = [];

  const search = node => {
    if (!node || !node.edges) return;
    Object.values(node.edges).map(edgeId => {
      const { parent, child } = edges[edgeId];
      if (parent === node.id) {
        nodesToDelete.push(child);
        edgesToDelete.push(edgeId);
        search(nodes[child]);
      }
    });
  };

  search(baseNode);

  return { nodesToDelete, edgesToDelete };
};

export {
  createNode,
  computeNodePositions,
  repositionNodes,
  createEdge,
  markChildNodesForDeletion
};
