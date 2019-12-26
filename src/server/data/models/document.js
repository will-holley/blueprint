import Model from "./_model";
import db from "./../db";

class Document extends Model {
  static get table() {
    return "document";
  }
  static _addFields(table) {
    table.string("name").nullable();
  }

  static async create(parent, args, context, info) {
    const returning = this._getReturnFields(info);
    const records = await this.db(this.table).insert(
      {
        human_id: this._generateHumanId()
      },
      returning
    );
    return this._resolveSQLResponse(records)[0];
  }
}

export default Document;
