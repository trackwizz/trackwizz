import request from "supertest";
import server from "../server";
import { Game } from "../entities/game";
import { Score } from "../entities/score";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entities/user";

let user: User;
let game: Game;
let score: Score;

async function createUser(): Promise<User> {
  const user: User = new User();
  user.name = "John";
  await getRepository(User).save(user);
  return user;
}

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

async function createScore(game: Game, user: User): Promise<Score> {
  const score: Score = new Score();
  score.idSpotifyTrack = "id-spotify-track";
  score.timestamp = new Date("2020-01-21T15:26:42.689Z");
  score.isCorrect = true;
  score.reactionTimeMs = 69;
  score.game = game;
  score.user = user;
  await getRepository(Score).save(score);
  return score;
}

beforeAll(async () => {
  user = await createUser();
  game = await createGame();
  score = await createScore(game, user);
});

afterAll(async () => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Score)
    .execute();
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .execute();
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Game)
    .execute();
});

describe("Test GET ALL", () => {
  it("should return pre-created score as a list", async () => {
    const res = await request(server)
      .get("/scores")
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(score.id);
    expect(res.body[0].idSpotifyTrack).toBe(score.idSpotifyTrack);
    expect(res.body[0].timestamp).toBe("2020-01-21T15:26:42.689Z");
    expect(res.body[0].isCorrect).toBe(score.isCorrect);
    expect(res.body[0].reactionTimeMs).toBe(score.reactionTimeMs);
    expect(res.body[0].user.id).toBe(user.id);
    expect(res.body[0].user.name).toBe(user.name);
  });
  it("should return pre-created score as a list, using game's ID", async () => {
    const res = await request(server)
      .get(`/scores?idGame=${game.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(score.id);
    expect(res.body[0].idSpotifyTrack).toBe(score.idSpotifyTrack);
    expect(res.body[0].timestamp).toBe("2020-01-21T15:26:42.689Z");
    expect(res.body[0].isCorrect).toBe(score.isCorrect);
    expect(res.body[0].reactionTimeMs).toBe(score.reactionTimeMs);
    expect(res.body[0].user.id).toBe(user.id);
    expect(res.body[0].user.name).toBe(user.name);
  });
});

describe("Test GET, DELETE, GET score", () => {
  it("should return pre-created score", async () => {
    const res = await request(server)
      .get(`/scores/${score.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.id).toBe(score.id);
    expect(res.body.idSpotifyTrack).toBe(score.idSpotifyTrack);
    expect(res.body.timestamp).toBe("2020-01-21T15:26:42.689Z");
    expect(res.body.isCorrect).toBe(score.isCorrect);
    expect(res.body.reactionTimeMs).toBe(score.reactionTimeMs);
  });
  it("should delete pre-created score", async () => {
    const res = await request(server)
      .delete(`/scores/${score.id}`)
      .send();
    expect(res.status).toEqual(204);
  });
  it("should not return pre-created score", async () => {
    const res = await request(server)
      .get(`/scores/${score.id}`)
      .send();
    expect(res.status).toEqual(404);
  });
});

describe("Test POST, PUT, GET", () => {
  const score: Score = new Score();
  score.idSpotifyTrack = "n3w-sp0t1fy-1d";
  score.timestamp = new Date("2020-01-21T15:26:42.689Z");
  score.isCorrect = false;
  score.reactionTimeMs = 69;
  score.game = game;
  score.user = user;

  it("should create a new score", async () => {
    const res = await request(server)
      .post("/scores")
      .send({
        idSpotifyTrack: "n3w-sp0t1fy-1d",
        timestamp: new Date("2020-01-21T15:26:42.689Z"),
        isCorrect: false,
        reactionTimeMs: 69,
        idGame: game.id,
        idUser: user.id,
      });
    expect(res.status).toEqual(200);
    score.id = res.body.id;
  });
  it("should update the score", async () => {
    const res = await request(server)
      .put(`/scores/${score.id}`)
      .send({
        reactionTimeMs: 999,
      });
    expect(res.status).toEqual(200);
  });
  it("should get the updated score", async () => {
    const res = await request(server)
      .put(`/scores/${score.id}`)
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.id).toBe(score.id);
    expect(res.body.idSpotifyTrack).toBe(score.idSpotifyTrack);
    expect(res.body.timestamp).toBe("2020-01-21T15:26:42.689Z");
    expect(res.body.isCorrect).toBe(score.isCorrect);
    expect(res.body.reactionTimeMs).toBe(999);
  });
});
