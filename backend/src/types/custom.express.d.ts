// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express-serve-static-core";
import NodeCache from "node-cache";
import { GameSessions } from "../gameSessions";

declare module "express-serve-static-core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface

  interface Request {
    appCache: NodeCache;
    gameSessions: GameSessions;
  }

  interface Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendJSON: (object: any) => void;
  }
}
