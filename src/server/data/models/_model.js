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
  static fetchById(req, res) {
    res.sendStatus(501);
  }
  static create(req, res) {
    res.sendStatus(501);
  }
  static update(req, res) {
    res.sendStatus(501);
  }
  static delete(req, res) {
    res.sendStatus(501);
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
