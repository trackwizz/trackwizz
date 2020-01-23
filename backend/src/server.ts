import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { RequestWithCache, setAppCache } from "./middlewares/app_cache";
import { removeTrailingSlash } from "./middlewares/trailing_slash";
import { spotifyRouter } from "./providers/spotify";
import { routes } from "./routes";
import WebSocket from "ws";
import MessageHandlerFactory from "./controllers/websockets_controller";

type ExpressWithWebSockets = Express & { ws: Function };

const server = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("express-ws")(server);

server.enable("strict routing");

/* --- Middlewares --- */
server.use(helmet());
server.use(cors());
server.use(removeTrailingSlash);
server.use(morgan("dev"));
server.use(bodyParser.json());
server.use(setAppCache);

server.get("/", (_, res: Response) => {
  res.status(200).send("TrackWizz server is running!");
});

/* --- Controllers --- */
server.use(routes);
server.use(spotifyRouter);

/* --- Websocket --- */
(server as ExpressWithWebSockets).ws("/", (ws: WebSocket, req: RequestWithCache) => {
  ws.on("message", MessageHandlerFactory(ws, req));
});

/* --- 404 Errors --- */
server.use((_, res: Response) => {
  res.status(404).send("Error 404 - Not found.");
});

export default server;
