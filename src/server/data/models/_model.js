import db from "./../db";
import logger from "./../../utils/logger";

const isDevelopment = process.env.NODE_ENV === "development";

class Model {
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

  static get ref() {
    return this.schema !== "public"
      ? `${this.schema}.${this.table}`
      : this.table;
  }

  /**
   * Should this table include a human id field?
   */
  static get _hasHumanId() {
    return true;
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
    logger.info(`Creating ${this.ref} table`);
    await db.schema.withSchema(this.schema).createTable(this.table, table => {
      //? Primary Key
      table
        .uuid("id")
        .primary()
        .defaultTo(db.raw("gen_random_uuid()"));
      //? Human Readable ID
      if (_this._hasHumanId) {
        table
          .string("human_id")
          .unique()
          .notNullable();
      }
      //? Timestamps
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
      table.timestamp("deleted_at");
      //? Model specific fields
      _this._addFields(table);
    });

    //$ Set up updated at trigger
    await db.raw(`
        CREATE TRIGGER ${this.table}_updated_at
        BEFORE UPDATE ON ${this.ref}
        FOR EACH ROW
        EXECUTE PROCEDURE on_update_timestamp();`);
  }
}

export default Model;
