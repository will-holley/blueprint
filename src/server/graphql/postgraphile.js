/**
 * Option Documentation:
 * https://www.graphile.org/postgraphile/usage-library/
 */

//* Libs
import { postgraphile } from "postgraphile";
//* Config
import { connectionString } from "./../data/db";
//* Postgraphile Plugins
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";

const commonOptions = {
  subscriptions: true,
  dynamicJson: true,
  ignoreRBAC: false,
  ignoreIndexes: false,
  setofFunctionsContainNulls: false,
  enableQueryBatching: true,
  legacyRelations: "omit",
  jwtSecret: process.env.JWT_SIGNATURE,
  appendPlugins: [PgSimplifyInflectorPlugin]
};
const devOptions = {
  watchPg: true,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  allowExplain: true,
  ...commonOptions
};
const prodOptions = {
  retryOnInitFail: true,
  extendedErrors: ["errcode"],
  graphiql: false,
  // TODO: The default Postgraphile logging has performance issues, but do make sure you have a logging system in place!
  disableQueryLog: true,
  ...commonOptions
};

export default postgraphile(
  connectionString,
  ["public", "document"], // schemas to expose
  process.env.NODE_ENV === "development" ? devOptions : prodOptions
);
