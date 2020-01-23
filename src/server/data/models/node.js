import Model from "./_model";
import Document from "./document";

class Node extends Model {
  static get table() {
    return "node";
  }

  static get schema() {
    return "document";
  }

  static _addFields(table) {
    //? Content Type
    table
      .enum("content_type", ["text"])
      .notNullable()
      .defaultTo("text");
    //? Content
    table.string("content").nullable();
    //? Document Foreign Key
    table.uuid("document").notNullable();
    table
      .foreign("document")
      .references("id")
      .inTable(Document.ref);
    table.index("document");
  }

  static _addComments(table) {
    // Avoid naming conflicts with Relay `Node`.
    table.comment("@name _node");
  }
}

export default Node;
