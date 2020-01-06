import express from "express";
import { hri } from "human-readable-ids";
// Database Utility
import db from "../data/db";
// Models
import Document from "../data/models/Document";
import Node from "../data/models/Node";
import Edge from "../data/models/Edge";
// Middleware
import { requiresAuthentication } from "./middleware";

//! Node Serializer

//! Create Router
const router = express();

router.post("/", requiresAuthentication, async function createNode(
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
    let edge = null;
    if (parentNodeId) {
      const rows = await db(Edge.table)
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
      edge = rows[0];
    }
    //? Return node and edge
    res.status(201);
    res.send([node, edge]);
  } catch (error) {
    res.send(error.message);
  }
});

router.patch("/:id", requiresAuthentication, async function updateNode(
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
 * TODO: fix a bug where this returns way more nodes / edges than are being deleted
 */
router.delete("/:id", requiresAuthentication, async function deleteNode(
  { params: { id } },
  res
) {
  try {
    // Get edge ids
    const { rows } = await db.raw(`
    WITH RECURSIVE sub_tree AS (
      SELECT id, node_a, node_b, deleted_at, 1 AS relative_depth
      FROM edge
      WHERE node_a = '${id}'

      UNION ALL

      SELECT e.id, e.node_a, e.node_b, e.deleted_at, st.relative_depth + 1
      FROM edge e, sub_tree st
      WHERE e.node_a = st.node_b AND e.deleted_at IS NOT NULL
    )
    SELECT * FROM sub_tree;
    `);
    let edgeIds = rows.map(({ id }) => id);

    // Gather all of the node ids
    const nodeIds = new Set();
    nodeIds.add(id);
    if (rows) {
      rows.forEach(({ node_a, node_b }) => {
        nodeIds.add(node_a);
        nodeIds.add(node_b);
      });

      // Update `edges.deleted_at`
      const deletedEdges = await db(Edge.table)
        .whereIn("id", edgeIds)
        // Include the parent edge of this node
        .orWhere("node_b", id)
        // Return deleted edge ids
        .update({ deleted_at: new Date() }, ["id"]);

      // Update edge ids to include parent edge id
      edgeIds = deletedEdges.map(({ id }) => id);
    }

    // Update `nodes.deleted_at`
    const nodeIdArray = [...nodeIds];
    await db(Node.table)
      .whereIn("id", nodeIdArray)
      .update({ deleted_at: new Date() });

    // Return an object containing the deleted node and edge ids
    res.status(200);
    res.send({
      nodeIds: nodeIdArray,
      edgeIds: edgeIds
    });
  } catch (error) {
    res.send(error.message);
  }
});

export default router;
