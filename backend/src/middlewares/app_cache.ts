import NodeCache from "node-cache";
import { NextFunction, Request, Response } from "express";
import gameSessions, { GameSessions } from "../app/gameSessions";

const cache = new NodeCache();

export type RequestWithCache = Request & {
  gameSessions: GameSessions;
  appCache: NodeCache;
};

/**
 * App cache middleware.
 * Save in the express Request object the AppCache and game Sessions that stores data shared in memory between users requests.
 *
 * NOTE: This system is not scalable. With this system, it is not possible to run multiple instances of
 * our server to respond to multiple requests.
 *
 * @param req
 * @param _res
 * @param next
 */
export function setAppCache(req: Request, _res: Response, next: NextFunction): void {
  req.appCache = cache;
  req.gameSessions = gameSessions;

  next();
}
