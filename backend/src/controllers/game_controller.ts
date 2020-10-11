import { NextFunction, Request, Response } from "express";
import { Controller, del, get, post, put } from "./controller";
import { getRepository } from "typeorm";
import { Game } from "../entities/game";
import { toDate } from "../utils";
import { Score } from "../entities/score";
import * as crypto from "crypto";
import { Track } from "../providers/track";
import { requestSpotifyTracks } from "../providers/spotify/tracks";
import { GameRoomManager } from "../app/gameRoomManager";
import { OutboundMessageType } from "../websockets/messages";

export class GameController extends Controller {
  constructor() {
    super("games");
  }

  @get()
  public async getGames(_req: Request, res: Response): Promise<void> {
    const games: Game[] = await getRepository(Game).find();
    res.send(games);
  }

  @get({ path: "/:id" })
  public async getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const game: Game | undefined = await getRepository(Game).findOne(id);
    if (game === undefined) {
      next();
      return;
    }
    res.sendJSON(game);
  }

  @get({ path: "/:id/scores" })
  public async getGameScores(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const game: Game | undefined = await getRepository(Game).findOne(id);
    if (game === undefined) {
      next();
      return;
    }
    const scores: Score[] = await getRepository(Score).find({
      relations: ["user"],
      where: { game: { id: game.id } },
    });
    res.send(scores);
  }

  @post()
  public async addGame(req: Request, res: Response): Promise<void> {
    // needed for spotify
    const token: string | undefined = req.header("Authorization");
    if (token === undefined) {
      throw new Error("Bearer authorization missing !");
    }
    const idSpotifyPlaylist: string | null = req.body.idSpotifyPlaylist || null;
    if (idSpotifyPlaylist === null) {
      throw new Error("Spotify id missing !");
    }
    const numberSongs: number = req.body.numberSongs || 0;

    let tracks: Array<Track>;
    try {
      tracks = await requestSpotifyTracks(token, idSpotifyPlaylist);
    } catch (e) {
      throw new Error("Error getting spotify tracks");
    }

    // save new game
    const game: Game = new Game();
    game.startDate = new Date(0);
    game.isEnded = false;
    game.score = 0;
    game.title = req.body.title || `game-${crypto.randomBytes(4).toString("hex")}`;
    game.setTracksAndQuestionsNumber(tracks, numberSongs);
    game.isPublic = req.body.isPublic || false;
    game.mode = parseInt(req.body.mode, 10) || 0;
    game.idSpotifyPlaylist = req.body.idSpotifyPlaylist || null;
    const { id } = await getRepository(Game).save(game);
    game.id = id;

    game.roomManager = new GameRoomManager();

    // set new game session
    game.currentTrackIndex = -1;
    game.currentPossibleAnswers = [];
    game.questionStartTimestamp = -1;
    game.receivedAnswersForCurrentTrack = [];
    req.gameSessions.addGame(game);

    // send game without tracks
    const userGame = { ...game };
    delete userGame.tracks;
    delete userGame.roomManager;
    res.sendJSON(userGame);
  }

  private static updateGameFields(req: Request, game: Game): Game {
    game.startDate = req.body.startDate !== undefined ? toDate(req.body.startDate) || new Date(new Date().getTime() + 30 * 1000) : game.startDate;
    game.isEnded = req.body.isEnded !== undefined ? req.body.isEnded : game.isEnded;
    game.score = parseInt(req.body.score, 10) || game.score;
    game.title = req.body.title || game.title;
    game.questionsNumber = parseInt(req.body.questionsNumber, 10) || game.questionsNumber;
    game.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : game.isPublic;
    game.mode = req.body.mode !== undefined ? parseInt(req.body.mode, 10) : game.mode;
    game.idSpotifyPlaylist = req.body.idSpotify || game.idSpotifyPlaylist;

    return game;
  }

  @put({ path: "/:id" })
  public async editGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    let game: Game | undefined = await getRepository(Game).findOne(id);
    if (game === undefined) {
      next();
      return;
    }

    game = GameController.updateGameFields(req, game);

    await getRepository(Game).save(game);

    let gameInSession = req.gameSessions.getGame(game.id);

    if (gameInSession) {
      gameInSession = GameController.updateGameFields(req, gameInSession);
      req.gameSessions.updateGame(gameInSession);

      gameInSession.roomManager.broadcastMessage({
        type: OutboundMessageType.WAITING_ROOM_UPDATE,
        players: gameInSession.roomManager.getUsers(),
        gameMode: gameInSession.mode,
      });
    }

    res.sendJSON(game);
  }

  @del({ path: "/:id" })
  public async deleteGame(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(Game).delete(id);
    res.status(204).send();
  }
}
