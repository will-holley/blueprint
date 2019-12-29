import express from "express";
import { hri } from "human-readable-ids";
// Database Utility
import db from "../data/db";
// Models
import Document from "../data/models/Document";
import Node from "../data/models/Node";
import Edge from "../data/models/Edge";

//! Node Serializer

const serializeNode = node => ({
  ...node,
  position: {
    x: null,
    y: null
  },
  dimensions: {
    height: 0,
    // the default width
    width: 300
  },
  depth: undefined
});

//! Create Router
const router = express();

router.post("/", async function createNode(
  { body: { documentId, parentNodeId } },
  res
) {
  try {
    //? Create node
    const [node] = await db(Node.table)
      .insert({
        human_id: hri.random(),
        document: documentId
      })
      .returning(["id", "human_id as humanId", "content_type as contentType"]);

    //? Create edge
    const [edge] = await db(Edge.table)
      .insert({
        human_id: hri.random(),
        node_a: parentNodeId,
        node_b: node.id,
        has_parent: true
      })
      .returning([
        "id",
        "human_id as humanId",
        "node_a as nodeA",
        "node_b as nodeB",
        "has_parent as hasParent"
      ]);

    //? Return node and edge
    res.status(201);
    res.send([serializeNode(node), edge]);
  } catch (error) {
    res.send(error.message);
  }
});

router.patch("/:id", async function updateNode(
  { params: { id }, body: { content } },
  res
) {
  try {
    await db(Node.table)
      .where("id", id)
      .update({ content });
    res.sendStatus(202);
  } catch (error) {
    res.send(error.message);
  }
});

/**
 * Delete node, all child nodes, and all edges pointing to this node.
 * TODO: get this down to 1 query with a recursive delete + join!
 */
router.delete("/:id", async function deleteNode({ params: { id } }, res) {
  try {
    //? Get edge ids
    const { rows } = await db.raw(`
    WITH RECURSIVE sub_tree AS (
      SELECT id, node_a, node_b, 1 AS relative_depth
      FROM edge
      WHERE node_a = '${id}'

      UNION ALL

      SELECT e.id, e.node_a, e.node_b, st.relative_depth + 1
      FROM edge e, sub_tree st
      WHERE e.node_a = st.node_b
    )
    SELECT * FROM sub_tree;
    `);
    //? Gather all of the node ids
    const nodeIds = new Set();
    rows.forEach(({ node_a, node_b }) => {
      nodeIds.add(node_a);
      nodeIds.add(node_b);
    });
    //? Delete Edges
    await db(Edge.table)
      .whereIn(
        "id",
        rows.map(({ id }) => id)
      )
      //$ Include the parent edge of this node
      .orWhere("node_b", id)
      .del();
    //? Delete Nodes
    await db(Node.table)
      .whereIn("id", [...nodeIds])
      .del();
    res.sendStatus(200);
  } catch (error) {
    res.send(error.message);
  }
});

export default router;
export { serializeNode };
