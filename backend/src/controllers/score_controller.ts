import { NextFunction, Request, Response } from "express";
import { Controller, del, get, post, put } from "./controller";
import { getRepository } from "typeorm";
import { Score } from "../entities/score";
import { Game } from "../entities/game";
import { User } from "../entities/user";
import { toDate } from "../utils";

export class ScoreController extends Controller {
  constructor() {
    super("scores");
  }

  @get()
  public async getScores(req: Request, res: Response): Promise<void> {
    const params: { where?: { game: { id: number } }; relations?: ["user"] } = req.query.idGame !== undefined ? { where: { game: { id: parseInt(req.query.idGame, 10) || 0 } } } : {};
    params.relations = ["user"];
    const scores: Score[] = await getRepository(Score).find(params);
    res.send(scores);
  }

  @get({ path: "/:id" })
  public async getScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const score: Score | undefined = await getRepository(Score).findOne(id);
    if (score === undefined) {
      next();
      return;
    }
    res.sendJSON(score);
  }

  @post()
  public async addScore(req: Request, res: Response): Promise<void> {
    const score: Score = new Score();
    score.idSpotifyTrack = req.body.idSpotifyTrack || req.body.spotifyTrackId || null;
    score.timestamp = req.body.timestamp !== undefined ? toDate(req.body.timestamp) : null;
    score.isCorrect = req.body.isCorrect || false;
    score.reactionTimeMs = parseInt(req.body.reactionTimeMs, 10) || 30 * 1000; // 30s per default
    score.game = new Game();
    score.game.id = parseInt(req.body.idGame, 10) || 0;
    score.user = new User();
    score.user.id = parseInt(req.body.idUser, 10) || 0;
    await getRepository(Score).save(score);
    res.sendJSON(score);
  }

  @put({ path: "/:id" })
  public async editScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const score: Score | undefined = await getRepository(Score).findOne(id);
    if (score === undefined) {
      next();
      return;
    }
    score.idSpotifyTrack = req.body.idSpotifyTrack || req.body.spotifyTrackId || score.idSpotifyTrack;
    score.timestamp = req.body.timestamp !== undefined ? toDate(req.body.timestamp) : score.timestamp;
    score.isCorrect = req.body.isCorrect !== undefined ? req.body.isCorrect : score.isCorrect;
    score.reactionTimeMs = parseInt(req.body.reactionTimeMs, 10) || score.reactionTimeMs;
    await getRepository(Score).save(score);
    res.sendJSON(score);
  }

  @del({ path: "/:id" })
  public async deleteScore(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(Score).delete(id);
    res.status(204).send();
  }
}
