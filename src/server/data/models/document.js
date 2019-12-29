import Model from "./_model";
import db from "./../db";
import Node from "./node";

class Document extends Model {
  static get table() {
    return "document";
  }
  static _addFields(table) {
    table.string("name").nullable();
  }
}

export default Document;
