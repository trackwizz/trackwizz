import request from "supertest";
import { getConnection, getRepository } from "typeorm";
import server from "../server";
import { Game } from "../entities/game";

jest.mock("../providers/spotify/tracks");

let game: Game;

async function createGame(): Promise<Game> {
  const game: Game = new Game();
  game.startDate = new Date("2020-01-21T15:24:16.331Z");
  game.isEnded = false;
  game.score = 0;
  game.title = "some game title 🙈";
  game.questionsNumber = 42;
  game.isPublic = true;
  game.mode = 2;
  game.idSpotifyPlaylist = "some_id";
  await getRepository(Game).save(game);
  return game;
}

beforeAll(async () => {
  game = await createGame();
});

afterAll(async () => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Game)
    .execute();
});

describe("Test GET ALL", () => {
  it("should return pre-created game as list", async () => {
    const res = await request(server)
      .get("/games")
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(game.id);
    expect(res.body[0].startDate).toBe("2020-01-21T15:24:16.331Z");
    expect(res.body[0].isEnded).toBe(game.isEnded);
    expect(res.body[0].score).toBe(game.score);
    expect(res.body[0].title).toBe(game.title);
    expect(res.body[0].questionsNumber).toBe(game.questionsNumber);
    expect(res.body[0].isPublic).toBe(game.isPublic);
    expect(res.body[0].mode).toBe(game.mode);
    expect(res.body[0].idSpotifyPlaylist).toBe(game.idSpotifyPlaylist);
  });
});

describe("Test GET, DELETE, GET game", () => {
  it("should return pre-created game", async () => {
    const res = await request(server)
      .get(`/games/${game.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.id).toBe(game.id);
    expect(res.body.startDate).toBe("2020-01-21T15:24:16.331Z");
    expect(res.body.isEnded).toBe(game.isEnded);
    expect(res.body.score).toBe(game.score);
    expect(res.body.title).toBe(game.title);
    expect(res.body.questionsNumber).toBe(game.questionsNumber);
    expect(res.body.isPublic).toBe(game.isPublic);
    expect(res.body.mode).toBe(game.mode);
    expect(res.body.idSpotifyPlaylist).toBe(game.idSpotifyPlaylist);
  });
  it("should delete pre-created game", async () => {
    const res = await request(server)
      .delete(`/games/${game.id}`)
      .send();
    expect(res.status).toEqual(204);
  });
  it("should not return pre-created game", async () => {
    const res = await request(server)
      .get(`/games/${game.id}`)
      .send();
    expect(res.status).toEqual(404);
  });
});

describe("Test POST, PUT, GET", () => {
  const game: Game = new Game();
  game.startDate = new Date(1579622125436);
  game.isEnded = false;
  game.score = 0;
  game.title = "new title";
  game.questionsNumber = 10;
  game.isPublic = false;
  game.mode = 1;
  game.idSpotifyPlaylist = "new_id";

  it("should create a new game", async () => {
    const res = await request(server)
      .post("/games")
      .auth("ooooohLookAtThisLovelyLittleAccessTokenHeIsSoooooCuteILoveItAlready!!!", { type: "bearer" })
      .send({
        startDate: 1579622125436,
        isEnded: game.isEnded,
        score: game.score,
        title: game.title,
        questionsNumber: game.questionsNumber,
        isPublic: game.isPublic,
        mode: game.mode,
        idSpotifyPlaylist: game.idSpotifyPlaylist,
      });
    expect(res.status).toEqual(200);
    game.id = res.body.id;
  });
  it("should update the game", async () => {
    const res = await request(server)
      .put(`/games/${game.id}`)
      .send({
        questionsNumber: 54,
        title: "AnOtHeR nEw TiTlE",
      });
    expect(res.status).toEqual(200);
  });
  it("should get the updated game", async () => {
    const res = await request(server)
      .put(`/games/${game.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.id).toBe(game.id);
    expect(typeof res.body.startDate).toEqual("string");
    expect(/^\d{4}-[0-1]\d-[0-3]\dT(\d{2}:?){3}.\d{3}Z$/.test(res.body.startDate)).toBeTruthy();
    expect(res.body.isEnded).toBe(game.isEnded);
    expect(res.body.score).toBe(game.score);
    expect(res.body.title).toBe("AnOtHeR nEw TiTlE");
    expect(res.body.questionsNumber).toBe(54);
    expect(res.body.isPublic).toBe(game.isPublic);
    expect(res.body.mode).toBe(game.mode);
    expect(res.body.idSpotifyPlaylist).toBe(game.idSpotifyPlaylist);
  });
});
