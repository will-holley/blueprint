import Model from "./_model";
import Document from "./document";
import update from "immutability-helper";

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

  static async create({ params: { id }, body: { documentId } }, res) {
    try {
      const rows = await this.db(this.table).insert(
        {
          human_id: this._generateHumanId(),
          document: documentId
        },
        ["*"]
      );
      res.status(201);
      res.send(rows[0]);
    } catch (error) {
      res.status(error);
    }
  }

  static async update(req, res) {
    // The only field which is editable is content
    const cleanReq = update(req, {
      body: {
        $set: {
          content: req.body.content
        }
      }
    });
    super.update(cleanReq, res);
  }

  /**
   * node/?d=<document_uuid>
   */
  static async fetchAll({ query: { d } }, res) {
    try {
      const rows = await this.db(this.table)
        .select("*")
        .where({ document: d, deleted_at: null });
      res.status(200);
      res.send(rows);
    } catch (error) {
      res.send(error);
    }
  }
}

export default Node;
