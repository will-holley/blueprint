import uuidv4 from "uuid/v4";
// https://github.com/d3/d3-hierarchy#hierarchy
import { stratify } from "d3-hierarchy";
// https://github.com/Klortho/d3-flextree
import { flextree } from "d3-flextree";
import { NodeType } from "./interfaces";

const DEFAULT_WIDTH = 200;

const createNode = (parentId: string): NodeType => ({
  id: uuidv4(),
  parentId,
  position: {
    x: null,
    y: null
  },
  dimensions: {
    //* Placeholder for Node layout.  This property is used to track height for position calculations.
    //* and is *not* passed into the CSS positioning (height is set to `auto`).
    height: 50,
    // Default width.  Used for both setting node CSS and tracking position.
    width: DEFAULT_WIDTH
  },
  content: {
    type: null,
    text: null
  },
  draggable: true
});

/**
 * Assigns hierarchical x/y coordinates to nodes
 */
const computeNodePositions = (nodes: Array<NodeType>): Array<object> => {
  const baseNode: object = stratify()(nodes);

  //* Use the flextree for now...
  const tree = flextree({
    spacing: (nodeA: object, nodeB: object): number => DEFAULT_WIDTH * 1.5,
    nodeSize: ({ data: { dimensions } }: object | any): [number, number] => {
      return [dimensions.height, dimensions.width];
    }
  });

  // Get positions
  const data = tree(baseNode);
  const descendants = data.descendants();

  // return {
  //   data,
  //   nodes: descendants
  // };
  return descendants;
};

export { createNode, computeNodePositions };
