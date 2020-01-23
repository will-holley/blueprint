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
      edges: [Edge]! @requires(columns: ["id"])
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
      },
      edges: async ({ id }, args, { pgClient }, resolveInfo) => {
        const { rows } = await pgClient.query(`
          SELECT * FROM document.edge WHERE id IN (
            SELECT DISTINCT(document.edge.id)
            FROM document.edge
            JOIN document.node ON document.node.id = document.edge.node_a OR document.node.id = document.edge.node_b
            WHERE document.node.document = '${id}'
          );`);
        return rows;
      }
    }
  }
}));
