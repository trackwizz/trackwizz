import { NextFunction, Request, Response } from "express";

export function logErrors(_req: Request, _res: Response, next: NextFunction): void {
  try {
    next();
  } catch (e) {
    console.error(e);
  }
}
