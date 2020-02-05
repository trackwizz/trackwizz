import NodeCache from "node-cache";
import { NextFunction, Request, Response } from "express";
import gameSessions, { GameSessions } from "../app/gameSessions";

const cache = new NodeCache();

export type RequestWithCache = Request & {
  gameSessions: GameSessions;
  appCache: NodeCache;
};

export function setAppCache(req: Request, _res: Response, next: NextFunction): void {
  req.appCache = cache;
  req.gameSessions = gameSessions;

  next();
}
