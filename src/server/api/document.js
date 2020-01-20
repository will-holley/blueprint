import express from "express";
import { hri } from "human-readable-ids";
import uuid from "uuid/v4";
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
  "deleted_at as deletedAt",
  "private"
];

//! ================
//! == Middleware ==
//! ================

const lookupDocument = async (req, res, next) => {
  // Otherwise, lookup this document
  const [doc] = await db(Document.table)
    .select("*")
    .where("id", req.params.id)
    .returning(1);
  // Check that the doc exists
  if (!doc) return res.sendStatus(400);
  // Add doc to request scope
  req.doc = doc;
  next();
};

/**
 * If this document is private, do not allow unauthorized users
 * from accessing it.
 */
const requiresAuthorizedAccess = async ({ user, doc }, res, next) => {
  try {
    return doc.private && doc.created_by !== user._id
      ? res.sendStatus(400)
      : next();
  } catch (error) {
    return res.send({ error: error.message });
  }
};

/**
 * If `req.user` does not match the owner of this document, reject this request.
 */
const creatorOnly = async ({ doc, user }, res, next) => {
  try {
    return doc.created_by !== user._id ? res.sendStatus(400) : next();
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
    const rows = await db(Document.ref)
      .select(fields)
      //.where("deleted_at", null)
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
    const [document] = await db(Document.ref)
      .insert({
        human_id: hri.random(),
        created_by: user._id
      })
      .returning(fields);
    //? Client expects empty objects.
    document.edges = {};
    document.nodes = {};
    //? Create a base node record
    await db(Node.ref).insert({
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
  [lookupDocument, requiresAuthorizedAccess],
  async function fetchDocumentDetails({ doc: { id } }, res) {
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
  [requiresAuthentication, lookupDocument, creatorOnly],
  async function updateDocumentDetails(
    { doc: { id }, body: { name, private: _private } },
    res
  ) {
    //? Compose update object with allowable fields
    const fields = {};
    if (name) fields["name"] = name;
    if (_private) fields["private"] = _private;
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
  [requiresAuthentication, lookupDocument, creatorOnly],
  async function deleteDocument({ doc: { id } }, res) {
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

/**
 * Duplicate this document (record + nodes + edges)
 * Duplicate essentially mimics the logic of create.
 */
router.post(
  "/:id/duplicate",
  [requiresAuthentication, lookupDocument, creatorOnly],
  async function duplicateDocument(
    { doc: { id, private: _private, name, human_id }, user },
    res
  ) {
    //? Duplicate document
    const [duplicateDocument] = await db(Document.table)
      .insert({
        //! Until there is table joining document records as having been duplicated,
        //! append with `-duplicate`.
        human_id: `${human_id}-duplicate-${hri.random()}`,
        created_by: user._id,
        private: _private,
        name: name ? `${name}-duplicate-${hri.random()}` : null
      })
      .returning(fields);

    //? Duplicate Nodes
    const nodes = await db(Node.table)
      .select("*")
      .where({ document: id, deleted_at: null });
    const duplicateNodes = []; // for sql insertion
    const duplicateNodeMap = {}; // for mapping edge nodes
    nodes.forEach(node => {
      //? Create the duplicate node id rather than relying on the
      //? sql function because it is necessary to map the edges from
      //? their old to new nodes.
      const duplicateNodeId = uuid();
      duplicateNodeMap[node.id] = duplicateNodeId;
      duplicateNodes.push({
        id: duplicateNodeId,
        human_id: `${node.human_id}-duplicate-${hri.random()}`,
        document: duplicateDocument.id,
        content: node.content,
        content_type: node.content_type
      });
    });
    await db(Node.table).insert(duplicateNodes);

    //? Gather the unique node ids
    const nodeIds = [...new Set(Object.keys(duplicateNodeMap))];

    //? Duplicate Edges
    const edges = await db(Edge.table)
      .select("*")
      .where({ deleted_at: null })
      .whereIn("node_a", nodeIds)
      .orWhereIn("node_b", nodeIds);

    const duplicateEdges = edges.map(edge => ({
      human_id: `${edge.human_id}-duplicate-${hri.random()}`,
      has_parent: edge.has_parent,
      node_a: duplicateNodeMap[edge.node_a],
      node_b: duplicateNodeMap[edge.node_b]
    }));
    await db(Edge.table).insert(duplicateEdges);

    //? Send document to client
    res.status(201);
    res.send(duplicateDocument);
  }
);

export default router;
