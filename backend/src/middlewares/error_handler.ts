import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

/**
 * Error middleware that prevent the app to crash if a request errored and log the error.
 *
 * @param _req: Express request object
 * @param _res: Express response object
 * @param next: Express next function
 */
export function logErrors(_req: Request, _res: Response, next: NextFunction): void {
  try {
    next();
  } catch (e) {
    logger.error(e);
  }
}
