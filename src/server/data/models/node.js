import Model from "./_model";
import Document from "./document";

class Node extends Model {
  static get table() {
    return "node";
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
    table.foreign("document").references(`${Document.table}.id`);
  }
}

export default Node;
