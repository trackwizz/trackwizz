import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";

enum MessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

/* --- Ping --- */
type PingMessage = {
  type: MessageType.PING;
};

const pingHandler = (ws: WebSocket, req: RequestWithCache, ping: PingMessage): void => {
  // TODO keep connection alive.
  console.log(ws, req, ping);
};

/* --- Join game --- */
type JoinGameMessage = {
  type: MessageType.JOIN_GAME;
  gameId: string;
};

const joinGameHandler = (ws: WebSocket, req: RequestWithCache, { gameId }: JoinGameMessage): void => {
  const game = req.gameSessions.getGame(gameId);

  if (!game) {
    ws.send(JSON.stringify({ type: MessageType.ERROR, message: "Game not found" }));
    return;
  }

  game.addPlayer(origin, ws);

  ws.send(JSON.stringify({ type: MessageType.SUCCESS }));
};

/* --- Root handler --- */
const MessageHandlerFactory = (ws: WebSocket, req: RequestWithCache) => (msg: string): void => {
  try {
    const content = JSON.parse(msg);

    if (content.type == MessageType.PING) {
      pingHandler(ws, req, content as PingMessage);
    }

    if (content.type == MessageType.JOIN_GAME) {
      const { gameId } = content;
      joinGameHandler(ws, req, gameId);
    }
  } catch (e) {
    ws.send(JSON.stringify({ type: MessageType.ERROR, message: "Invalid message" }));
  }
};

export default MessageHandlerFactory;
