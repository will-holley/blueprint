import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCollide,
  forceX,
  forceY,
  forceRadial
} from "d3-force";

import { VERTEX_DIAMETER } from "./../constants";
const VERTEX_RADIUS = VERTEX_DIAMETER / 2;

// Set up a web worker
// const worker = new Worker("layoutComputer");

// worker.onmessage = event => {

// };

function D3Force(vertices, edges) {
  // Create extensive references of vertices and edges, as well as D3 compatible
  // representations
  const verticesById = {};
  const nodes = []; // d3 nomenclature for vertices
  const links = []; // d3 nomenclature for edges
  vertices.forEach(v => {
    verticesById[v.id] = Object.assign(
      {
        width: -1,
        height: -1
      },
      v
    );
    nodes.push({
      id: v.id,
      radius: VERTEX_DIAMETER
    });
  });
  edges.forEach(e => {
    const { id, nodeA, nodeB } = e;
    links.push({
      source: nodeA,
      target: nodeB
    });
  });

  // Instantiate simulation
  const sim = forceSimulation(nodes);
  // Add forces
  sim
    .force(
      "charge",
      forceManyBody()
        .strength(-50)
        .theta(2)
    )
    .force(
      "link",
      forceLink(links)
        .id(d => d.id)
        .distance(0)
        .strength(1)
    )
    .force(
      "collision",
      forceCollide()
        .radius(d => d.radius)
        .strength(2)
    )
    .force("x", forceX())
    .force("y", forceY())
    .stop();

  // Tick through simulation
  const trialsCount = Math.ceil(
    Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay())
  );
  for (let i = 0; i < trialsCount; ++i) {
    sim.tick();
  }

  // Extract positions from nodes and set edge positions
  const positionedNodes = sim.nodes();
  positionedNodes.forEach(({ id, x, y, vx, vy }) => {
    verticesById[id]["position"] = { x, y };
  });

  const positionedEdges = edges.map(e => {
    const source = verticesById[e.nodeA].position;
    const target = verticesById[e.nodeB].position;
    return Object.assign(
      {
        position: [
          { x: source.x + VERTEX_RADIUS, y: source.y + VERTEX_RADIUS },
          { x: target.x + VERTEX_RADIUS, y: target.y + VERTEX_RADIUS }
        ]
      },
      e
    );
  });

  return [Object.values(verticesById), positionedEdges];
}

export default D3Force;
