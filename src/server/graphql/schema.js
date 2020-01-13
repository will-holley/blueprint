import { makeExtendSchemaPlugin, gql } from "graphile-utils";

const extendedSchemas = makeExtendSchemaPlugin(buid => ({
  typeDefs: gql`
    extend type Document {
      createdByUser: Boolean! @requires(columns: ["created_by"])
    }
  `,
  resolvers: {
    Document: {
      createdByUser: async (parent, args, context, resolveInfo) => {
        return true;
      }
    }
  }
}));

export default extendedSchemas;
