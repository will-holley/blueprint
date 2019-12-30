import dagre from "dagre";
import { calculateNodeHeight } from "./utils";

function dagger(nodes, edges) {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set up graph
  g.setGraph({
    rankDir: "TB",
    nodesep: 100,
    ranksep: 100
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  //? Insert each node
  Object.keys(nodes).forEach(id => {
    g.setNode(id, {
      width: 300, // always 300
      height: calculateNodeHeight(id)
    });
  });

  //? Insert each edge, making a record of the edge b/c dagre doesn't support
  //? edge ids.
  const edgesByNodes = {};
  Object.values(edges).forEach(({ id, nodeA, nodeB }) => {
    g.setEdge(nodeA, nodeB);
    edgesByNodes[`${nodeA}-${nodeB}`] = id;
  });

  //? Compute the layout
  dagre.layout(g);

  //? Add position back to nodes and edges
  g.nodes().forEach(id => {
    const { x, y, height } = g.node(id);
    nodes[id].position = { x, y };
    nodes[id].height = height;
  });

  //? Map edges w/ offsets
  const widthOffset = 150; // width never changes.
  g.edges().map(e => {
    const { v, w } = e;
    const edgeId = edgesByNodes[`${v}-${w}`];
    // offset by 1/2 of the height of the source node.  add 5
    // because edges are represented with dashed lines and we want
    // the edge to appear vertically balanced.
    const heightOffset = nodes[v].height / 2 + 5;
    edges[edgeId].position = g.edge(e).points.map(({ x, y }) => ({
      // Align to the middle of each node
      x: x + widthOffset,
      y: y + heightOffset
    }));
  });

  return [nodes, edges];
}

export default dagger;
