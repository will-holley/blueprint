import Model from "./_model";
import User from "./user";

class Document extends Model {
  static get table() {
    return "document";
  }
  static _addFields(table) {
    //? Name
    table.string("name").nullable();
    //? Owner Foreign key
    table.uuid("created_by").notNullable();
    table.foreign("created_by").references(`${User.table}.id`);
    //? Visibility
    table
      .boolean("private")
      .notNullable()
      .defaultTo(true);
  }
}

export default Document;
