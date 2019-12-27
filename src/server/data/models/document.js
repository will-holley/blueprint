import Model from "./_model";
import db from "./../db";

class Document extends Model {
  static get table() {
    return "document";
  }
  static _addFields(table) {
    table.string("name").nullable();
  }

  static async create(req, res) {
    try {
      const rows = await this.db(this.table).insert(
        {
          human_id: this._generateHumanId()
        },
        ["*"]
      );
      res.status(201);
      res.send(rows[0]);
    } catch (error) {
      res.send(error);
    }
  }

  static async fetchAll(req, res) {
    try {
      const rows = await this.db(this.table)
        .select("*")
        .where("deleted_at", null)
        .orderBy("updated_at", "desc");
      res.status(200);
      res.send(rows);
    } catch (error) {
      res.send(error);
    }
  }
}

export default Document;
