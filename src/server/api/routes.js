import express from "express";
import bodyParser from "body-parser";
// Models
import Document from "./../data/models/document";
import Node from "./../data/models/node";
import Edge from "./../data/models/edge";

const buildAPI = model => {
  const router = express();
  // Attach middleware
  model.middleware.forEach(middleware => router.use(middleware));
  // Attach CRUD request handlers
  router.get("/", model.fetchAll);
  router.get("/:id", model.fetchById);
  router.post("/", model.create);
  router.put("/", model.update);
  router.delete("/", model.delete);
  // Return the router instance
  return router;
};

// Router Setup
const router = express({
  caseSensitive: false
});

// Add Middlewares
// parse request body as json
router.use(bodyParser.json());
// parse application/x-www-form-urleconded
router.use(bodyParser.urlencoded({ extended: true }));

// Health check the API
router.get("/", (req, res) => res.sendStatus(200));

// Attach models CRUD routes.
router.use("/document", buildAPI(Document));
router.use("/node", buildAPI(Node));
router.use("/edge", buildAPI(Edge));

// Export
export default router;
