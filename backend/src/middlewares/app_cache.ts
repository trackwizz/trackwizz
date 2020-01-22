import NodeCache from "node-cache";
import { NextFunction, Request, Response } from "express";
import { GameSessions } from "../gameSessions";

const cache = new NodeCache();
const gameSessions = new GameSessions();

export function setAppCache(req: Request, _res: Response, next: NextFunction): void {
  req.appCache = cache;
  req.gameSessions = gameSessions;
  next();
}
