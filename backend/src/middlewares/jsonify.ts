import { NextFunction, Request, Response } from "express";
import stringify from "json-stable-stringify";

/**
 * Middleware that adds to the express response object the util function 'sendJSON'
 * that takes an object and send an http application/json response to the client.
 *
 * @param _req: Express request object
 * @param res: Express response object
 * @param next: Express next function
 */
export function jsonify(_req: Request, res: Response, next: NextFunction): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.sendJSON = (object: any): void => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(stringify(object));
  };
  next();
}
