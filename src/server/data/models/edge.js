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

  static async create({ body: { nodeA, nodeB, hasParent } }, res) {
    const rows = await this.db(this.table).insert(
      {
        human_id: this._generateHumanId(),
        node_a: nodeA,
        node_b: nodeB,
        has_parent: hasParent
      },
      ["id"]
    );
    res.status(201);
    res.send(rows[0]);
  }

  /**
   * TODO: merge this with the identical function
   * from `node.js`.
   * edge/?d=<document_uuid>
   */
  static async fetchAll({ query: { d } }, res) {
    try {
      const rows = await this.db(this.table)
        .select("*")
        .where({ document: d, deleted_at: null });
      res.status(200);
      res.send(rows);
    } catch (error) {
      res.send(error);
    }
  }
}

export default Edge;
