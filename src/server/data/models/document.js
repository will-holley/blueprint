import Model from "./_model";
import User from "./user";

class Document extends Model {
  static get table() {
    return "document";
  }

  static get schema() {
    return "document";
  }

  static _addFields(table) {
    //? Name
    table.string("name").nullable();
    //? Owner Foreign key
    table
      .uuid("created_by")
      .notNullable() // automatically set by a SQL trigger + immutable
      .comment("@omit create,update,delete");
    table
      .foreign("created_by")
      .references("id")
      .inTable(User.ref);
    table.index("created_by");
    //? Visibility
    table
      .boolean("private")
      .notNullable()
      .defaultTo(true);
  }
}

export default Document;
