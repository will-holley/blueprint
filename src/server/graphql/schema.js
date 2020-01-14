import { makeExtendSchemaPlugin, gql } from "graphile-utils";

const extendedSchemas = makeExtendSchemaPlugin(buid => ({
  typeDefs: gql`
    extend type Document {
      createdByUser: Boolean! @requires(columns: ["created_by"])
    }
  `,
  resolvers: {
    Document: {
      createdByUser: async (
        { createdBy },
        args,
        { jwtClaims: { user_id: userId } },
        resolveInfo
      ) => createdBy === userId
    }
  }
}));

export default extendedSchemas;
