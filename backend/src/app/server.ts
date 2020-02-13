import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import WebSocket from "ws";
import MessageHandlerFactory from "../controllers/websockets_controller";
import swaggerUi from "swagger-ui-express";
import { apiSpecs } from "../utils/swagger";
import { RequestWithCache, setAppCache } from "../middlewares/app_cache";
import { removeTrailingSlash } from "../middlewares/trailing_slash";
import { spotifyRouter } from "../providers/spotify";
import { routes } from "../routes";
import { logErrors } from "../middlewares/error_handler";

type ExpressWithWebSockets = Express & { ws: Function };

const server = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("express-ws")(server);

server.enable("strict routing");

/* --- Middlewares --- */
server.use(logErrors);
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

/* --- OpenAPI --- */
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpecs));

/* --- 404 Errors --- */
server.use((_, res: Response) => {
  res.status(404).send("Error 404 - Not found.");
});

export default server;
