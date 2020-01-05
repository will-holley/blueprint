import db from "./index";
import models from "./../models";

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

async function createExtensionsAndFunctions() {
  try {
    const queryString = `${extensions.join("")}${functions.join("")}`;
    await db.raw(queryString);
  } catch (error) {
    throw new Error(error);
  }
}

async function dropTables() {
  //? This cannot run in production.
  if (process.env.NODE_ENV === "production") return;
  //? Drop
  const commands = Object.values(models).map(
    api => `DROP TABLE IF EXISTS ${api.schema}.${api.table} CASCADE;`
  );
  await db.raw(commands.join(""));
}

async function createTables(force = false) {
  if (force) await dropTables();
  // Create tables if they don't exist
  Object.entries(models).forEach(async ([name, api]) => {
    await api.createTable();
  });
}

export { createExtensionsAndFunctions, createTables, dropTables };
