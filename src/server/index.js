//* Libraries
import "dotenv/config";
import cors from "cors";
import express from "express";
//* Database
import setupDatabase from "./data/db/setup";
import createPGQLClient from "./graphql/postgraphile";
//* Utils
import logger, { httpLogger } from "./utils/logger";
//* Environment Variables
const { SERVER_PORT } = process.env;

const app = express();
app.use(cors());
app.use(httpLogger);
app.use(express.json());

(async () => {
  // Setup the database
  await setupDatabase(true);

  // Attach the graphql client only after database
  // setup is complete
  app.use(createPGQLClient());

  // Start the express server
  app.listen(SERVER_PORT);
  logger.info(`Server live on localhost:${SERVER_PORT}`);
})();

//? Export for testing
export default app;
