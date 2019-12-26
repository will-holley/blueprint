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

  static async create(parent, { documentId }, context, info) {
    const returning = this._getReturnFields(info);
    // Insert records first
    const [{ id }] = await this.db(this.table).insert(
      {
        human_id: this._generateHumanId(),
        document: documentId
      },
      ["id"]
    );
    // Query the record respecting that the query may contained
    // joined document props.
    const records = await this.db(this.table)
      .join(
        Document.table,
        `${this.table}.document`,
        "=",
        `${Document.table}.id`
      )
      .select(returning)
      .where(`${this.table}.id`, id);
    return this._resolveSQLResponse(records)[0];
  }
}

export default Node;
