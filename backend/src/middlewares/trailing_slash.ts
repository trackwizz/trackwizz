import { NextFunction, Request, Response } from "express";

/**
 * Middleware that removes the trailing slash at the end of a request path.
 * /login/  ----> /login
 *
 * @param req
 * @param res
 * @param next
 */
export function removeTrailingSlash(req: Request, res: Response, next: NextFunction): void {
  if (req.path.indexOf("api-docs") !== -1) {
    next();
    return;
  }

  if (req.path.substr(-1) === "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
}
