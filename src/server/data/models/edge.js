import Model from "./_model";
import Node from "./node";

class Edge extends Model {
  static get schema() {
    return "document";
  }
  static get table() {
    return "edge";
  }
  static _addFields(table) {
    //? Nodes
    table.uuid("node_a").notNullable();
    table.uuid("node_b").notNullable();
    table
      .foreign("node_a")
      .references("id")
      .inTable(Node.ref)
      .onDelete("CASCADE");
    table
      .foreign("node_b")
      .references("id")
      .inTable(Node.ref)
      .onDelete("CASCADE");
    table.unique(["node_a", "node_b"]);
    //? Has Parent?
    table
      .boolean("has_parent")
      .defaultTo(false)
      .notNullable();
  }
}

export default Edge;
