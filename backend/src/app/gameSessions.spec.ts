import { getConnection, getRepository } from "typeorm";
import { Game } from "../entities/game";
import { GameSessions } from "./gameSessions";
import { GameRoomManager } from "./gameRoomManager";

let game: Game;
let gameSessions: GameSessions;

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
  game.roomManager = new GameRoomManager();
  game.tracks = Array(4).fill({
    previewUrl: "https://p.scdn.co/mp3-preview/1234?cid=1234",
    id: "1234",
    name: "We will rock you",
    trackNumber: 0,
    artist: "Queen",
  });
  game.questionsNumber = 4;
  game.currentTrackIndex = -1;
  gameSessions = new GameSessions();
});

afterAll(async () => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Game)
    .execute();
});

describe("Test game in game session", () => {
  it("Should insert a new game in the game sessions", () => {
    gameSessions.addGame(game);
    expect(gameSessions.getGame(game.id)).toBeDefined();
  });
  it("Should update the game", async () => {
    await game.update();
    const updatedGame = gameSessions.getGame(game.id);
    expect(updatedGame).toBeDefined();
    if (updatedGame === undefined) {
      return;
    }
    expect(updatedGame.currentTrackIndex).toBe(0);
    expect(updatedGame.updateTimeout).toBeDefined();
    expect(updatedGame.otherTracksIndexes.length).toBe(3);
    expect(updatedGame.isEnded).toBeFalsy();
  });
  it("Should end the game", async () => {
    await game.update();
    await game.update();
    await game.update();
    await game.update();
    const endedGame = gameSessions.getGame(game.id);
    expect(endedGame).toBeDefined();
    if (endedGame === undefined) {
      return;
    }
    expect(endedGame.isEnded).toBeTruthy();
  });
  it("Should delete the game in the game sessions", async () => {
    await gameSessions.deleteGame(game.id);
    expect(gameSessions.getGame(game.id)).toBeUndefined();
  });
});
