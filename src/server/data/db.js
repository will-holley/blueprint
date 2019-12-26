import knex from "knex";
import logger from "../utils/logger";

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER
} = process.env;

// Alternatively
const dbUrl = `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:5432/${DATABASE_NAME}`;

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  // the default settings:
  pool: { min: 2, max: 10 },
  log: {
    warn: message => logger.warn(message),
    error: message => logger.error(message),
    deprecate: message => logger.warn(message),
    debug: message => logger.debug(message)
  }
});

// run default database setup
const extensions = ["CREATE EXTENSION IF NOT EXISTS pgcrypto;"];
const functions = [
  //! `or replace` seems precarious.
  //TODO: research replacing it with `IF NOT EXISTS`
  `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`
];
const queryString = `${extensions.join("")}${functions.join("")}`;
db.raw(queryString);

export default db;
export { dbUrl };
