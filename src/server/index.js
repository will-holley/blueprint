// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
// Data
import db, { dbUrl } from "./data/db";
import models from "./data/models";
// Utils
import logger from "./utils/logger";
// API
import router from "./api/routes";

// Environment
const { SERVER_PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";
const FORCE_TABLES = false;

// Create server instance
const app = express();
// Attach Middleware
app.use(cors());
// Attach API Router
app.use("/api/1", router);

async function connectDatabase() {
  // If `FORCE_TABLES` is true, tables are deleted and recreated.
  // Ensure this occurs within a single transaction to avoid deadlocks.
  if (FORCE_TABLES && isDev) {
    const commands = Object.values(models).map(
      api => `DROP TABLE IF EXISTS ${api.schema}.${api.table} CASCADE;`
    );
    await db.raw(commands.join(""));
  }
  // Create tables if they don't exist
  Object.entries(models).forEach(async ([name, api]) => {
    await api.createTable();
  });
}

// TODO Check if any migrations need to be applied
async function applyMigrations() {
  return;
}

async function startServer() {
  await app.listen(SERVER_PORT);
  logger.info(`Server live on localhost:${SERVER_PORT}`);
}

(async () => {
  await connectDatabase();
  await applyMigrations();
  await startServer();
})();
