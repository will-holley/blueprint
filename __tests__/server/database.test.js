//* Database Modules
import db from "../../src/server/data/db";
import models from "../../src/server/data/models";

describe("Database", () => {
  it("creates extension pgcrypto", async () => {
    const {
      rows: [result]
    } = await db.raw(
      "select pg_get_functiondef(to_regproc('gen_random_uuid'))"
    );
    expect(result["pg_get_functiondef"]).not.toBeNull();
  });

  it("creates function on_update_timestamp", async () => {
    const {
      rows: [result]
    } = await db.raw(
      "select pg_get_functiondef('on_update_timestamp()'::regprocedure)"
    );
    expect(result["pg_get_functiondef"]).not.toBeNull();
  });

  it("creates tables", async () => {
    const tableNames = Object.values(models).map(model => model.table);
    let [{ count }] = await db("information_schema.tables")
      .count("*")
      .whereIn("table_name", tableNames);
    count = parseInt(count);
    expect(count).toEqual(tableNames.length);
  });
});
