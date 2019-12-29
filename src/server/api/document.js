import express from "express";
import { hri } from "human-readable-ids";
// Database Utility
import db from "../data/db";
// Models
import Document from "../data/models/Document";
import Node from "../data/models/Node";
import Edge from "../data/models/Edge";

//! Create Router
const router = express();

//! ===============
//! == Endpoints ==
//! ===============

router.get("/", async function fetchAllDocuments(req, res) {
  try {
    //? Query all documents
    const rows = await db(Document.table)
      .select(["id", "human_id as humanId", "name", "updated_at as updatedAt"])
      .where("deleted_at", null)
      .orderBy("updated_at", "desc");
    //? Create a map of document ids to documents, including empty objects for nodes
    //? and edges.
    const docIdMap = rows.reduce(
      (obj, doc) => ({ ...obj, [doc.id]: { ...doc, nodes: {}, edges: {} } }),
      {}
    );
    res.status(200);
    res.send(docIdMap);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async function createDocument(req, res) {
  try {
    //? Insert the document record
    const [document] = await db(Document.table)
      .insert({ human_id: hri.random() })
      .returning([
        "id",
        "human_id as humanId",
        "name",
        "updated_at as updatedAt"
      ]);
    //? Client expects empty objects.
    document.edges = {};
    document.nodes = {};
    //? Create a base node record
    await db(Node.table).insert({
      human_id: hri.random(),
      document: document.id
    });
    //? Send document to client
    res.status(201);
    res.send(document);
  } catch (error) {
    res.send(error.message);
  }
});

/**
 * Load the nodes and edges for a document.
 */
router.get("/:id", async function fetchDocumentDetails(
  { params: { id } },
  res
) {
  //? Client expects nodes and edges as id value maps.
  const details = {
    nodes: {},
    edges: {}
  };
  try {
    //? Query Nodes
    const nodes = await db(Node.table)
      .select([
        "id",
        "human_id as humanId",
        "content",
        "content_type as contentType"
      ])
      .where({ document: id, deleted_at: null });
    //? Add to id value map with additional details
    nodes.forEach(node => {
      details.nodes[node.id] = node;
    });
    //? Create a list of node ids for querying edges
    const nodeIds = nodes.map(({ id }) => id);
    //? Query Edges
    const edges = await db(Edge.table)
      .select([
        "id",
        "human_id as humanId",
        "has_parent as hasParent",
        "node_a as nodeA",
        "node_b as nodeB"
      ])
      .whereIn("node_a", nodeIds)
      .orWhereIn("node_b", nodeIds);
    //? Map edges to object
    edges.forEach(edge => {
      details.edges[edge.id] = edge;
    });
    //? Return details to client
    res.status(200);
    res.send(details);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async function updateDocumentDetails(req, res) {});

router.delete("/:id", async function deleteDocument({ params: { id } }, res) {
  try {
    const updatedCount = await db(Document.table)
      .where("id", id)
      .update({ deleted_at: new Date() });
    // Response will indicate how many records were updated.
    const responseStatus = updatedCount !== 0 ? 200 : 400;
    res.sendStatus(responseStatus);
  } catch (error) {
    res.send(error);
  }
});

export default router;
