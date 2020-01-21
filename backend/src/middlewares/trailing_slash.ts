import { NextFunction, Request, Response } from 'express';

export function removeTrailingSlash(req: Request, res: Response, next: NextFunction): void {
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
}
