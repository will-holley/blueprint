//* Libraries
import request from "supertest";
//* Server Modules
import app from "../../src/server/index";
import db from "../../src/server/data/db";
import {
  createExtensionsAndFunctions,
  createTables
} from "../../src/server/data/db/setup";
import models from "../../src/server/data/models";

test("Server starts and listens for requests", async () => {
  const res = await request(app).get("/api/1/");
  expect(res.statusCode).toEqual(200);
});

describe("Database", () => {
  //? Setup the database.
  beforeAll(async () => {
    await createExtensionsAndFunctions();
    await createTables(true);
  });

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
    const [{ count }] = await db("information_schema.tables")
      .count("*")
      .whereIn("table_name", tableNames);
    const c = parseInt(count);
    expect(c).toEqual(tableNames.length);
  });
});
