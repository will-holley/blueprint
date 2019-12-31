import Model from "./_model";

class Document extends Model {
  static get table() {
    return "document";
  }
  static _addFields(table) {
    table.string("name").nullable();
  }
}

export default Document;
