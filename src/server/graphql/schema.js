import { makeExtendSchemaPlugin, gql, embed } from "graphile-utils";

export default makeExtendSchemaPlugin(({ pgSql: sql, inflection }) => ({
  typeDefs: gql`
    extend type Document {
      createdByUser: Boolean @requires(columns: ["created_by"])
      _nodes: [_Node]! @pgQuery(
        source: ${embed(sql.fragment`document.node`)}
        withQueryBuilder: ${embed((queryBuilder, args) => {
          queryBuilder.where(
            sql.fragment`${queryBuilder.getTableAlias()}.document = ${queryBuilder.parentQueryBuilder.getTableAlias()}.id`
          );
        })}
      )
    }
  `,
  resolvers: {
    Document: {
      createdByUser: async (
        { createdBy },
        args,
        { jwtClaims },
        resolveInfo
      ) => {
        return jwtClaims ? createdBy === jwtClaims.user_id : null;
      }
    }
  }
}));
