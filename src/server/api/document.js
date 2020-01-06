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

//! Create Router
const router = express();

//! Fields returned by document selections
const fields = [
  "id",
  "human_id as humanId",
  "name",
  "updated_at as updatedAt",
  "created_by as createdBy",
  "private"
];

//! ================
//! == Middleware ==
//! ================

/**
 * If this is a private document and the user does not match,
 * reject this request.
 */
const requiresDocumentOwnership = async (
  { params: { id }, user },
  res,
  next
) => {
  try {
    const [doc] = await db(Document.table)
      .select(["private", "created_by as createdBy"])
      .where("id", id)
      .returning(1);
    return !doc || (doc.private && doc.createdBy !== user._id)
      ? res.sendStatus(400)
      : next();
  } catch (error) {
    return res.send({ error: error.message });
  }
};

//! ===============
//! == Endpoints ==
//! ===============

router.get("/", async function fetchAllDocuments(req, res) {
  try {
    //? Check if there is a logged in user
    const user = req.user && req.user._id ? req.user : null;
    //? Query all documents
    const rows = await db(Document.table)
      .select(fields)
      .where("deleted_at", null)
      .andWhere(function() {
        //? Select public documents
        this.where("private", false);
        //? Select all of user's documents
        if (user) {
          this.orWhere("created_by", user._id);
        }
      })
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

router.post("/", requiresAuthentication, async function createDocument(
  { user },
  res
) {
  try {
    //? Insert the document record
    const [document] = await db(Document.table)
      .insert({
        human_id: hri.random(),
        created_by: user._id
      })
      .returning(fields);
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
router.get(
  "/:id",
  requiresDocumentOwnership,
  async function fetchDocumentDetails({ params: { id } }, res) {
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
        .where({ document: id, deleted_at: null })
        .orderBy("created_at");
      //? Add to id value map with additional details. Denote the base node.
      let baseMarked = false;
      nodes.forEach(node => {
        if (!baseMarked) {
          node.isBase = true;
          baseMarked = true;
        }
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
        .where({ deleted_at: null })
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
  }
);

router.put(
  "/:id",
  [requiresAuthentication, requiresDocumentOwnership],
  async function updateDocumentDetails(
    { params: { id }, body: { name } },
    res
  ) {
    //? Compose update object with allowable fields
    const fields = {};
    if (name) fields["name"] = name;
    //? Update
    try {
      await db(Document.table)
        .where("id", id)
        .update(fields);
      res.sendStatus(200);
    } catch (error) {
      res.send(error.message);
    }
  }
);

router.delete(
  "/:id",
  [requiresAuthentication, requiresDocumentOwnership],
  async function deleteDocument({ params: { id } }, res) {
    try {
      const updatedCount = await db(Document.table)
        .where("id", id)
        .update({ deleted_at: new Date() });
      // Response will indicate how many records were updated.
      const responseStatus = updatedCount !== 0 ? 200 : 400;
      res.sendStatus(responseStatus);
    } catch (error) {
      res.send(error.message);
    }
  }
);

export default router;
