import { makeExtendSchemaPlugin, gql } from "graphile-utils";

const extendedSchemas = makeExtendSchemaPlugin(buid => ({
  typeDefs: gql`
    extend type Document {
      createdByUser: Boolean @requires(columns: ["created_by"])
    }
  `,
  resolvers: {
    Document: {
      createdByUser: async ({ createdBy }, args, { jwtClaims }, resolveInfo) =>
        jwtClaims ? createdBy === jwtClaims.user_id : null
    }
  }
}));

export default extendedSchemas;
