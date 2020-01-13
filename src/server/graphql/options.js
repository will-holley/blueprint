/**
 * Option Documentation:
 * https://www.graphile.org/postgraphile/usage-library/
 */
//* Config Params
import { ownerConnection } from "./../data/db";
//* Postgraphile Plugins
import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import extendedSchemas from "./schema";

const commonOptions = {
  subscriptions: true,
  dynamicJson: true,
  ignoreRBAC: false,
  // Allow expensive queries (due to missing indices)
  ignoreIndexes: true,
  setofFunctionsContainNulls: false,
  enableQueryBatching: true,
  legacyRelations: "omit",
  appendPlugins: [
    PgSimplifyInflectorPlugin,
    ConnectionFilterPlugin,
    extendedSchemas
  ],
  exportGqlSchemaPath: "schema.graphql",
  // Security
  ownerConnectionString: ownerConnection,
  jwtSecret: process.env.JWT_SIGNATURE,
  jwtPgTypeIdentifier: "public.jwt_token"
};

const devOptions = {
  watchPg: true,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
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

export default process.env.NODE_ENV === "development"
  ? devOptions
  : prodOptions;
