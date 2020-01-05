//* Libraries
import request from "supertest";
//* Server Modules
import app from "../../src/server/index";

describe("Server", () => {
  it("listens for requests", async () => {
    const res = await request(app).get("/api/1/");
    expect(res.statusCode).toEqual(200);
  });
});
