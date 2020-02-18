/**
 * @fileoverview
 *
 * A Force-Directed Algorithm for Drawing Directed Graphs Symmetrically
 * https://www.hindawi.com/journals/mpe/2018/6208509/
 *
 * 1. Use Tarjan (swapped from HL-DPC, because the origin paper for HL-DPC is unavailable and it seems that
 * there is some bias in choosing this SCC detection algorithm) to detect Strongly Connected Components
 *
 * 2. Fix cycle vertices with CD-CP algorithm
 *
 * 3. Apply FR (Fruchterman and Reingold Force Direction) to non-leaf vertices
 *
 * 4. Apply LD (leaf distribution algorithm) to distribute leaf vertices evenly around the centers of the star-subgraphs created by Tarjan.
 */
import { default as Graph } from "tarjan-graph"; // https://github.com/tmont/tarjan-graph
import { calculateNodeHeight } from "./utils";
import { VERTEX_DIAMETER } from "./../constants";

// ===============
// == Constants ==
// ===============

// All vertexes should have the same radius, so set these equal to each other equal to 1/2 vertex width.
const VERTEX_RADIUS = VERTEX_DIAMETER / 2;
// Star vertex radius i.e Vi (center of concentric leaf vertices)
// NOTE: generally radius center is an integer of radius leaf [4.2], however I have not
// witnessed a visual need for it currently (perhaps because vertices are not rendered as
// circles?)
const RADIUS_CENTER = VERTEX_DIAMETER / 2;
// Leaf vertex radius
const RADIUS_LEAF = VERTEX_DIAMETER / 2;
// The amount of space between the borders of leaf vertex and V
// i.e. the interior padding of a concentric circle (ring).
// TODO: i'm not sure this is actually what it does...
// See 4.2 for the original description of DCircle
const V_LEAF_GAP = 10;

// ====================
// == Sub-Algorithms ==
// ====================

/**
 * CD-CP Algorithm
 * See Figure 4
 * @param {Array} SCC
 * @param {Object} verticesById
 */
function CDCP(SCC, verticesById) {
  const Rc = 100;
  const R = 200;

  const numberOfCycles = SCC.length;

  // If there is only 1 cycle set
  if (numberOfCycles === 1) {
    const loneCycle = SCC[0];
    const cycleSize = loneCycle.length;
    // Iterate through each vertex in the cycle
    for (let i = 0; i < cycleSize; i++) {
      const v = loneCycle[i];
      const position = (2 * Math.PI * i) / cycleSize;
      verticesById[v.id].position.x = Rc * Math.cos(position);
      verticesById[v.id].position.y = Rc * Math.sin(position);
    }
  } else {
    for (let i = 0; i < numberOfCycles; i++) {
      const cycle = SCC[i];
      const cycleSize = cycle.length;
      const position = (2 * Math.PI * i) / numberOfCycles;
      // Referred to as `O(c)x` in the literature and denotes the center of circle for cycle `c`
      const cycleCenterX = R * Math.cos(position);
      const cycleCenterY = R * Math.sin(position);
      // Iterate through each vertex in this cycle to place it
      for (let j = 0; j < cycleSize; j++) {
        const vertex = cycle[j];
        const { id } = vertex;
        const position = (2 * Math.PI * j) / cycleSize;
        verticesById[id].position.x = cycleCenterX + Rc * Math.cos(position);
        verticesById[id].position.y = cycleCenterY + Rc * Math.sin(position);
      }
    }
  }
  return verticesById;
}

/**
 * Given a star [does this matter?] vertex Vi, connecting several leaf vertices, then,
 * 1) count the number of leaf vertices for Vi
 * 2) calculate the number of leaf vertices that can be placed on every layer of concentric circle around Vi
 * 3) calculate the number of concentric circles needed by Vi
 * TODO: only pass in star vertices? -- is a trivial SCC a star vertex?
 *
 * @param {*} V
 */
function LD(verticesById, edgesById) {
  const vertices = Object.values(verticesById);

  vertices.forEach(v => {
    // Find all leaf vertices of vertex `v`
    const leaves = [];
    v.edgesByNodeA.nodes.forEach(e => {
      const neighborId = edgesById[e.id].nodeB;
      const neighbor = verticesById[neighborId];
      // Check if neighbor is a leaf vertex
      if (
        // Neighboring vertex has no successors and 1 ancestor
        // i.e. it is of degree > 0 to v alone
        neighbor.edgesByNodeA.nodes.length === 0 &&
        neighbor.edgesByNodeB.nodes.length === 1
      ) {
        leaves.push(neighborId);
      }
    });

    const leafNumber = leaves.length;

    // If v has no leaves, there is nothing left to do.
    if (leafNumber === 0) return;

    // counter of the number of vertices placed
    // [denoted as `i`]
    let verticesRenderedInRingCounter = 1;
    // counter of concentric rings; a positive integer incrementing monotonically
    // [denoted as `l`]
    let currentRingCounter = 1;

    // Calculate the number of vertices that can be placed in the first concentric ring
    // around v
    // TODO: setting the gap dynamically based on vertex size should resize everything else
    // TODO: without needing to modify the logic that supports multiple rings (when `V_LEAF_GAP`
    // TODO: is statically set.)
    const a1 =
      Math.PI /
      Math.asin(
        RADIUS_LEAF /
          (V_LEAF_GAP +
            RADIUS_LEAF +
            RADIUS_CENTER * verticesRenderedInRingCounter)
      );

    const twoA1 = 2 * a1;

    // The number of concentric circles needed by V is the maximum value of l
    // [denoted as `L`].
    //? Note: ideally there is only 1 ring, so `l` and `L` are always 1
    // TODO: why 9, 72, etc.?
    const totalRings =
      (9 - twoA1 + Math.sqrt(Math.pow(twoA1 - 9, 2) + 72 * leafNumber)) / 18;

    // After placement of leaf vertices on the (L-1)th layer circle,
    // Calculate the number of vertices not yet placed
    // [`aRest_at_L` in Algorithm 2]
    const unplacedVertices =
      leafNumber -
      (totalRings - 1) * a1 -
      9 * (totalRings - 1) * (totalRings - 2);

    // For each `w` in `V` where `w` is a leaf vertex of `v`
    leaves.forEach(leafId => {
      const w = verticesById[leafId];

      // Calculate how many vertices can be placed at `l` i.e. its vertex capacity
      // [`a` in Algorithm 2]
      // TODO: work out the proof for this
      // TODO: 13b and 13c do not equal each other so i cannot see why 13c replaces
      // TODO: 13b in 4.2 ... intellectual laziness on their part or am i missing something?
      let ringCapacity = a1 + (currentRingCounter - 1) * 9;
      //// let proof =
      ////   Math.PI /
      ////   Math.asin(
      ////     RADIUS_LEAF /
      ////       ((3 * currentRingCounter - 1) * RADIUS_LEAF +
      ////         RADIUS_CENTER * verticesRenderedInRingCounter)
      ////   );
      //// console.log({
      ////   ringCapacity,
      ////   proof,
      ////   equal: Boolean(ringCapacity === proof)
      //// });

      if (verticesRenderedInRingCounter > ringCapacity) {
        // Step into the next concentric ring
        // Reset
        verticesRenderedInRingCounter = 1;
        // Step into next ring
        currentRingCounter += 1;
        // Increase ring capacity because ring is further away from center
        // and there is more space to render nodes.
        // TODO: should likely not be fixed at 9
        ringCapacity += 9;
      }
      // If this is the final ring, place all remaining
      if (currentRingCounter === totalRings) {
        ringCapacity = unplacedVertices;
      }
      // Radius of the lth layer concentric circle
      const r = VERTEX_RADIUS + (3 * currentRingCounter - 1) * RADIUS_LEAF;
      // Calculate where in the orbit this vertex should fall
      const position =
        (2 * Math.PI * verticesRenderedInRingCounter) / ringCapacity;
      // Set x and y of w (leaf) relative to the position of v
      console.log({ position, verticesRenderedInRingCounter, ringCapacity });
      const x = verticesById[v.id].position.x + r * Math.cos(position);
      const y = verticesById[v.id].position.y + r * Math.sin(position);
      verticesById[w.id].position = { x, y };

      verticesRenderedInRingCounter += 1;
    });
  });

  return verticesById;
}

/**
 * https://gist.github.com/abruzzi/352e757103988e370568369a34dad87b
 * @param {Array} SCC
 * @param {Object} verticesById
 */
function FR(SCC, verticesById) {
  return verticesById;
}

// ====================
// == Main Algorithm ==
// ====================

function FDS(vertices, edges) {
  // With positions
  let V = vertices.map(vertex =>
    Object.assign(
      {
        position: { x: 0, y: 0 },
        height: calculateNodeHeight(vertex.id),
        width: VERTEX_DIAMETER
      },
      vertex
    )
  );

  // Vertices by id
  let verticesById = {};
  V.forEach(v => {
    verticesById[v.id] = v;
  });

  // Edges by id
  let edgesById = {};
  edges.forEach(e => {
    edgesById[e.id] = e;
  });

  // Create a digraph in order to run Trajan's algo
  const D = new Graph();
  vertices.forEach(({ id, edgesByNodeA: { nodes } }) => {
    const children = nodes.map(edge => edgesById[edge.id].nodeB);
    D.add(id, children);
  });

  // Get strongly connected components
  // Returns an array containing arrays of vertices
  // i.e. [[v, ..., v], ..., [v, ..., v]]
  //let SCC = D.getStronglyConnectedComponents();
  let SCC = D.getCycles();

  // Add an id attribute b/c `tarjan-graph` keys ids as `name` and
  // consistent nomenclature is less confusing.
  SCC = SCC.map(cycle => cycle.map(v => ({ id: v.name, ...v })));

  // // CD-CP
  // verticesById = CDCP(SCC, verticesById);

  // // Run FR on non-leaf vertices
  // verticesById = FR(SCC, verticesById);

  // Leaf Distribution
  verticesById = LD(verticesById, edgesById);

  // Set edge positions
  // TODO: pad
  const E = edges.map(e => {
    const nodeA = verticesById[e.nodeA];
    const nodeB = verticesById[e.nodeB];

    let aX = nodeA.position.x + VERTEX_RADIUS;
    let aY = nodeA.position.y + nodeA.height / 2;
    let bX = nodeB.position.x + VERTEX_RADIUS;
    let bY = nodeB.position.y + nodeB.height / 2;

    return Object.assign(
      {
        position: [
          { x: aX, y: aY },
          { x: bX, y: bY }
        ]
      },
      e
    );
  });

  return [Object.values(verticesById), E];
}

export default FDS;
