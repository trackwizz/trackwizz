import { Request, Response } from 'express';
import { Controller, get } from './controller';

export class UserController extends Controller {
  constructor() {
    super('users');
  }

  @get()
  public async getThemes(req: Request, res: Response): Promise<void> {
    const count: number = req.appCache.get<number>('count') || 0;
    req.appCache.set<number>('count', count + 1);
    res.sendJSON({
      count,
    });
  }
}
