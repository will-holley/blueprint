import { hri } from "human-readable-ids";
import db from "./../db";
import logger from "./../../utils/logger";

const isDevelopment = process.env.NODE_ENV === "development";

class Model {
  //! ===============
  //! == Accessors ==
  //! ===============
  static get db() {
    return db;
  }

  //! =================
  //! == Express ==
  //! =================

  static get middleware() {
    return [];
  }
  static fetchAll(req, res) {
    res.sendStatus(501);
  }

  static async fetchById({ params: { id } }, res) {
    try {
      const rows = await this.db(this.table)
        .select("*")
        .where("id", id);
      res.status(200);
      res.send(rows[0]);
    } catch (error) {
      res.send(error);
    }
  }

  static create(req, res) {
    res.sendStatus(501);
  }

  static async update({ params: { id }, body }, res) {
    try {
      const updatedCount = await this.db(this.table)
        .where("id", id)
        .update(body);
      res.sendStatus(updatedCount !== 0 ? 200 : 400);
    } catch (error) {
      res.send(error);
    }
  }

  static async delete({ params: { id } }, res) {
    try {
      const updatedCount = await this.db(this.table)
        .where("id", id)
        .update({ deleted_at: new Date() });
      // Response will indicate how many records were updated.
      const responseStatus = updatedCount !== 0 ? 200 : 400;
      res.sendStatus(responseStatus);
    } catch (error) {
      res.send(error);
    }
  }

  //! =====================
  //! == Private Methods ==
  //! =====================
  static _generateHumanId() {
    return hri.random();
  }

  //! ==========================
  //! == Inheritance Specific ==
  //! ==========================
  static get table() {
    throw new Error("Model.table Not Implemented");
  }

  static get schema() {
    // Public by default
    return "public";
  }

  /**
   * @private
   */
  static _addFields(table) {
    throw new Error("Model.addFields Not Implemented");
  }

  //! ====================
  //! == Public Methods ==
  //! ====================

  static async exists() {
    return db.schema.withSchema(this.schema).hasTable(this.table);
  }

  static async createTable() {
    const _this = this;

    // If this table does not exist and existence should
    // be checked.
    const exists = await this.exists();
    if (exists) return;

    // Set up schema
    logger.info(`Creating ${this.table} table`);
    await this.db.schema
      .withSchema(this.schema)
      .createTable(this.table, table => {
        //? Primary Key
        table
          .uuid("id")
          .primary()
          .defaultTo(_this.db.raw("gen_random_uuid()"));
        //? Human Readable ID
        table
          .string("human_id")
          .unique()
          .notNullable();
        //? Timestamps
        table.timestamp("created_at").defaultTo(_this.db.fn.now());
        table.timestamp("updated_at").defaultTo(_this.db.fn.now());
        table.timestamp("deleted_at");
        //? Model specific fields
        _this._addFields(table);
      });

    //$ Set up updated at trigger
    await this.db.raw(`
        CREATE TRIGGER ${this.table}_updated_at
        BEFORE UPDATE ON ${this.table}
        FOR EACH ROW
        EXECUTE PROCEDURE on_update_timestamp();
      `);
  }
}

export default Model;
