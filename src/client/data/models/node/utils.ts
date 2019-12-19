import uuidv4 from "uuid/v4";
import { hri } from "human-readable-ids";
// https://github.com/d3/d3-hierarchy#hierarchy
import { stratify } from "d3-hierarchy";
// https://github.com/Klortho/d3-flextree
import { flextree } from "d3-flextree";
import { NodeType, NodesType } from "./interfaces";

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
  children: [],
  depth: undefined
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
    // add parent->children relationships to store for arrow ui-traversal
    if (node.parent) {
      _nodes[node.parent.id].children = node.parent.children.map(
        (c: object | any) => c.id
      );
    }
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

export { createNode, computeNodePositions, repositionNodes };
