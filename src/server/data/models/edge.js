import Model from "./_model";
import Node from "./node";

class Edge extends Model {
  static get table() {
    return "edge";
  }
  static _addFields(table) {
    //? Nodes
    table.uuid("node_a").notNullable();
    table.uuid("node_b").notNullable();
    table.foreign("node_a").references(`${Node.table}.id`);
    table.foreign("node_b").references(`${Node.table}.id`);
    table.unique(["node_a", "node_b"]);
    //? Has Parent?
    table
      .boolean("has_parent")
      .defaultTo(false)
      .notNullable();
  }

  static async create(parent, { nodeA, nodeB, hasParent }, context, info) {
    const returning = this._getReturnFields(info);
    // Insert records first
    const table = this.table;
    const [{ id }] = await this.db(this.table).insert(
      {
        human_id: this._generateHumanId(),
        node_a: nodeA,
        node_b: nodeB,
        has_parent: hasParent
      },
      ["id"]
    );
    const records = await this.db(this.table)
      .innerJoin(Node.table, function() {
        this.on(`${Node.table}.id`, "=", `${table}.node_a`).orOn(
          `${Node.table}.id`,
          "=",
          `${table}.node_b`
        );
      })
      .select(returning)
      .where(`${this.table}.id`, id);
    return this._resolveSQLResponse(records)[0];
  }

  // static async fetchByDocument(parent, { documentId }, context, info) {
  //   //? Currently, cross-document linking is not available, so find all
  //   //? edges where nodeA.document is equal to documentId.
  //   // return Edge.findAll({
  //   //   include: [
  //   //     {
  //   //       model: Node,
  //   //       as: "nodeA",
  //   //       where: {
  //   //         document: documentId
  //   //       }
  //   //     },
  //   //     {
  //   //       model: Node,
  //   //       as: "nodeB"
  //   //     }
  //   //   ]
  //   // });
  //   return "foo";
  // }

  // static async fetchById(parent, { id }, context, info) {
  //   return "foo";
  // }
}

export default Edge;
