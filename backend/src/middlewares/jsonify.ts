import { NextFunction, Request, Response } from "express";
import stringify from "json-stable-stringify";

export function jsonify(_: Request, res: Response, next: NextFunction): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.sendJSON = (object: any): void => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(stringify(object));
  };
  next();
}
