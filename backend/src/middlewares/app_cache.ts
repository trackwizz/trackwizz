import NodeCache from "node-cache";
import { NextFunction, Request, Response } from "express";

const cache = new NodeCache();

export function setAppCache(req: Request, _res: Response, next: NextFunction): void {
  req.appCache = cache;
  next();
}
