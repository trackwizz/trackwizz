import { NextFunction, Request, Response } from 'express';
import { Controller, del, get, post, put } from './controller';
import { getRepository } from 'typeorm';
import { Game } from '../entities/game';

export class GameController extends Controller {
  constructor() {
    super('games');
  }

  @get()
  public async getGames(_req: Request, res: Response): Promise<void> {
    const games: Game[] = await getRepository(Game).find();
    res.send(games);
  }

  @get({ path: '/:id' })
  public async getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const game: Game | undefined = await getRepository(Game).findOne(id);
    if (game === undefined) {
      next();
      return;
    }
    res.sendJSON(game);
  }

  @post()
  public async addGame(req: Request, res: Response): Promise<void> {
    const game: Game = new Game();
    game.startDate = req.body.startDate !== undefined ? new Date(req.body.startDate) : null;
    game.isEnded = false;
    game.score = 0;
    game.title = req.body.title || null;
    game.questionsNumber = 0;
    game.isPublic = req.body.isPublic || false;
    game.mode = parseInt(req.body.mode, 10) || 0;
    game.idSpotify = req.body.idSpotify || null;
    await getRepository(Game).save(game);
    res.sendJSON(game);
  }

  @put({ path: '/:id' })
  public async editGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const game: Game | undefined = await getRepository(Game).findOne(id);
    if (game === undefined) {
      next();
      return;
    }
    game.startDate = req.body.startDate !== undefined ? new Date(req.body.startDate) : game.startDate;
    game.isEnded = req.body.isEnded !== undefined ? req.body.isEnded : game.isEnded;
    game.score = parseInt(req.body.score, 10) || game.score;
    game.title = req.body.title || game.title;
    game.questionsNumber = parseInt(req.body.questionsNumber, 10) || game.questionsNumber;
    game.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : game.isPublic;
    game.mode = parseInt(req.body.mode, 10) || game.mode;
    game.idSpotify = req.body.idSpotify || game.idSpotify;
    await getRepository(Game).save(game);
    res.sendJSON(game);
  }

  @del({ path: '/:id' })
  public async deleteGame(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(Game).delete(id);
    res.status(204).send();
  }
}
