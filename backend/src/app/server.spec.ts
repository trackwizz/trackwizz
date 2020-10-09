import request from "supertest";
import server from "./server";
import { getConnection } from "typeorm";

describe("Test server is running", () => {
  it("should return hello world", async () => {
    const res = await request(server).get("/").send();
    expect(res.status).toEqual(200);
    expect(res.text).toBe("TrackWizz server is running!");
  });
});

describe("Test DB connection", () => {
  it("should connect to DB", async () => {
    expect(await getConnection().isConnected).toBe(true);
  });
});
