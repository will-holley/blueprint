//* Libraries
import "dotenv/config";
import cors from "cors";
import express from "express";
//* Database
import db from "./data/db";
import { createExtensionsAndFunctions, createTables } from "./data/db/setup";
//* Utils
import logger, { httpLogger } from "./utils/logger";
//* API
import router from "./api/routes";
import postgraphile from "./graphql/postgraphile";
//* Environment Variables
const { SERVER_PORT } = process.env;

//? Create server instance
const app = express();

//? Attach Middleware
app.use(cors());
app.use(httpLogger);
app.use(express.json());

//? Attach API Router
app.use("/api/1", router);

// //? Attach GraphQL Router
app.use(postgraphile);

/**
 * Checks that the database is connected.
 */
async function validateDatabaseConnection() {
  try {
    const {
      rows: [{ result }],
      ...response
    } = await db.raw("select 1+1 as result");
    if (result === 2) {
      logger.info("Database connection initialized");
    } else {
      throw new Error(response.toString());
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

/**
 * Starts Express server.
 */
async function startServer() {
  await app.listen(SERVER_PORT);
  logger.info(`Server live on localhost:${SERVER_PORT}`);
}

(async () => {
  await validateDatabaseConnection();
  // await createExtensionsAndFunctions();
  // await createTables(true);
  await startServer();
})();

//? Export for testing
export default app;
