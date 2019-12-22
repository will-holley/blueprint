import uuidv4 from "uuid/v4";
import { hri } from "human-readable-ids";
// https://github.com/d3/d3-hierarchy#hierarchy
import { stratify } from "d3-hierarchy";
// https://github.com/Klortho/d3-flextree
import { flextree } from "d3-flextree";
import { NodeType, NodesType, EdgeType, EdgesType } from "./interfaces";

const DEFAULT_WIDTH = 300;
const NODE_SPACING = DEFAULT_WIDTH;

const createNode = (parentId: string): NodeType => ({
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
const createEdge = (
  parent: string | null,
  child: string | null,
  peers: Array<string> | null
): EdgeType => ({
  _id: uuidv4(),
  id: hri.random(),
  parent: parent ? parent : null,
  child: child ? child : null,
  peers: peers
    ? peers.reduce((acc: { [key: string]: boolean }, id: string) => {
        acc[id] = true;
        return acc;
      }, {})
    : null
});

/**
 * Assigns hierarchical x/y coordinates to nodes
 */
const computeNodePositions = (nodes: Array<NodeType>): Array<object> => {
  const baseNode: object = stratify()(nodes);

  //* Use the flextree for now...
  const layout: any = flextree({
    // Determines how far adjacent nodes in that diagram should appear
    spacing: DEFAULT_WIDTH,
    nodeSize: ({
      data: { id, dimensions }
    }: object | any): [number, number] => [dimensions.width, dimensions.height]
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
const repositionNodes = (nodes: NodesType): NodesType => {
  const _nodes: NodesType = nodes;
  const asArray: Array<NodeType> = Object.values(_nodes);
  computeNodePositions(asArray).forEach((node: object | any) => {
    // Add position to this node
    _nodes[node.id].position = {
      x: node.x,
      y: node.y
    };
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
const markChildNodesForDeletion = (
  baseNode: NodeType,
  nodes: NodesType,
  edges: EdgesType
): { [key: string]: string[] } => {
  // By design the given node is to be deleted.
  const nodesToDelete: string[] = [baseNode.id];
  const edgesToDelete: string[] = [];

  const search = (node: NodeType): void => {
    if (!node || !node.edges) return;
    Object.values(node.edges).map((edgeId: string) => {
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
