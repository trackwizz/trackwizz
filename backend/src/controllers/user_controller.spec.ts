import request from "supertest";
import server from "../app/server";
import { User } from "../entities/user";
import { getConnection, getRepository } from "typeorm";

let user: User;

async function createUser(): Promise<User> {
  const user: User = new User();
  user.id = "john";
  user.name = "John";
  await getRepository(User).save(user);
  return user;
}

beforeAll(async () => {
  user = await createUser();
});

afterAll(async () => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .execute();
});

describe("Test GET ALL", () => {
  it("should return pre-created user as a list", async () => {
    const res = await request(server)
      .get("/users")
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(user.id);
    expect(res.body[0].name).toBe(user.name);
  });
});

describe("Test GET, DELETE, GET user", () => {
  it("should return pre-created user", async () => {
    const res = await request(server)
      .get(`/users/${user.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.id).toBe(user.id);
    expect(res.body.name).toBe(user.name);
  });
  it("should delete pre-created user", async () => {
    const res = await request(server)
      .delete(`/users/${user.id}`)
      .send();
    expect(res.status).toEqual(204);
  });
  it("should not return pre-created user", async () => {
    const res = await request(server)
      .get(`/users/${user.id}`)
      .send();
    expect(res.status).toEqual(404);
  });
});

describe("Test POST, PUT, GET", () => {
  const user: User = new User();
  user.id = "mickey";
  user.name = "Mickey";
  it("should create a new user", async () => {
    const res = await request(server)
      .post("/users")
      .send({
        id: user.id,
        name: user.name,
      });
    expect(res.status).toEqual(200);
    user.id = res.body.id;
  });
  it("should update the user", async () => {
    const res = await request(server)
      .put(`/users/${user.id}`)
      .send({
        name: "Donald",
      });
    expect(res.status).toEqual(200);
  });
  it("should get the updated user", async () => {
    const res = await request(server)
      .get(`/users/${user.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.id).toBe(user.id);
    expect(res.body.name).toBe("Donald");
  });
});
