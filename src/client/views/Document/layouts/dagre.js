import dagre from "dagre";
import { calculateNodeHeight } from "./utils";

function dagger(nodes) {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set up graph
  g.setGraph({
    rankDir: "TB",
    nodesep: 15,
    ranksep: 25
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  // Create flat records of each edge, making a record of the node-edge b/c dagre doesn't support edge ids.
  const edgesByNodes = {};
  const edges = {};

  // Insert each node
  const nodesById = {};
  nodes.forEach(node => {
    const { id, edgesByNodeA, edgesByNodeB } = node;
    nodesById[id] = Object.assign({}, node);

    // Add to graph
    g.setNode(id, {
      width: 300, // always 300
      height: calculateNodeHeight(id)
    });

    // Insert edges
    edgesByNodeA.nodes.forEach(({ nodeB, id: edgeId, ...edge }) => {
      g.setEdge(id, nodeB);
      edges[edgeId] = {
        id: edgeId,
        nodeA: id,
        nodeB,
        ...edge
      };
      edgesByNodes[`${id}-${nodeB}`] = edgeId;
    });

    edgesByNodeB.nodes.forEach(({ nodeA, id: edgeId, ...edge }) => {
      g.setEdge(nodeA, id);
      edges[edgeId] = {
        id: edgeId,
        nodeA,
        nodeB: id,
        ...edge
      };
      edgesByNodes[`${nodeA}-${id}`] = edgeId;
    });
  });

  //? Compute the layout
  dagre.layout(g);

  //? Add position back to nodes and edges
  g.nodes().forEach(id => {
    const { x, y, height } = g.node(id);
    nodesById[id].position = { x, y };
    nodesById[id].height = height;
  });

  //? Map edges w/ offsets
  const widthOffset = 150; // width never changes.
  g.edges().map(e => {
    const { v, w } = e;
    const edgeId = edgesByNodes[`${v}-${w}`];
    // offset by 1/2 of the height of the source node.  add 5
    // because edges are represented with dashed lines and we want
    // the edge to appear vertically balanced.
    const heightOffset = nodesById[v].height / 2 + 5;
    edges[edgeId].position = g.edge(e).points.map(({ x, y }) => ({
      // Align to the middle of each node
      x: x + widthOffset,
      y: y + heightOffset
    }));
  });

  return [nodesById, edges];
}

export default dagger;
