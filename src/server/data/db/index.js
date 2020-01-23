import knex from "knex";
import logger from "../../utils/logger";

//? Set up the database connection string to read the environment-specific
//? credentials.
const env = process.env.NODE_ENV.toUpperCase();
const host = process.env[`${env}_DATABASE_HOST`];
const name = process.env[`${env}_DATABASE_NAME`];
const password = process.env[`${env}_DATABASE_PASSWORD`];
const user = process.env[`${env}_DATABASE_USER`];

const ownerConnection = `postgres://${user}:${password}@${host}:5432/${name}`;

const graphqlUser = process.env["GRAPHQL_USER"];
const postgraphileConnection = `postgres://${graphqlUser}:${password}@${host}:5432/${name}`;

const db = knex({
  client: "pg",
  connection: ownerConnection,
  // the default settings:
  pool: {
    min: 2,
    max: 10
  },
  log: {
    warn: message => logger.warn(message),
    error: message => logger.error(message),
    deprecate: message => logger.warn(message),
    debug: message => logger.debug(message)
  }
});

export default db;
export { ownerConnection, postgraphileConnection };
