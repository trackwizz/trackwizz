import { NextFunction, Request, RequestHandler, Response } from "express";
import { logger } from "../utils/logger";

export function handleErrors(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((err: Error) => {
      logger.error(err.message);
      logger.error(JSON.stringify(err.stack));
      res.setHeader("Content-Type", "application/json");
      res.status(500).send(err.message);
    });
  };
}
