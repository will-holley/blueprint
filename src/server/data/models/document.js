import Model from "./_model";
import db from "./../db";

class Document extends Model {
  static get table() {
    return "document";
  }
  static _addFields(table) {
    table.string("name").nullable();
  }

  /**
   * Adds empty nodes + edges arrays
   * @param {*} rows
   */
  static _serialize(rows) {
    return rows.map(row => {
      row.nodes = [];
      row.edges = [];
      return row;
    });
  }

  static async create(req, res) {
    try {
      const rows = await this.db(this.table).insert(
        {
          human_id: this._generateHumanId()
        },
        ["*"]
      );
      const ready = this._serialize(rows);
      res.status(201);
      res.send(ready[0]);
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
      const ready = this._serialize(rows);
      res.status(200);
      res.send(ready);
    } catch (error) {
      res.send(error);
    }
  }
}

export default Document;
