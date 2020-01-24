import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";

enum InboundMessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
}

enum OutboundMessageType {
  WAITING_ROOM_UPDATE = "WAITING_ROOM_UPDATE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

const getOrigin = (req: RequestWithCache): string => {
  const origin = req.headers.origin;
  if (!origin) {
    throw new Error("No origin present on the request");
  }

  return origin.toString();
};

/* --- Ping --- */
type PingMessage = {
  type: InboundMessageType.PING;
  gameId: string;
};

const pingHandler = (ws: WebSocket, req: RequestWithCache, { gameId }: PingMessage): void => {
  const game = req.gameSessions.getGame(gameId);

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found" }));
    return;
  }

  game.roomManager.updateLastPing(getOrigin(req));
};

/* --- Join game --- */
type JoinGameMessage = {
  type: InboundMessageType.JOIN_GAME;
  gameId: string;
};

const joinGameHandler = (ws: WebSocket, req: RequestWithCache, { gameId }: JoinGameMessage): void => {
  const game = req.gameSessions.getGame(gameId);

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found." }));
    return;
  }

  const origin = getOrigin(req);
  game.roomManager.addPlayer(origin, ws);

  game.roomManager.broadcastMessage({
    type: OutboundMessageType.WAITING_ROOM_UPDATE,
    players: game.roomManager.getPlayers(),
  });
};

/* --- Root handler --- */
const MessageHandlerFactory = (ws: WebSocket, req: RequestWithCache) => (msg: string): void => {
  try {
    const content = JSON.parse(msg);

    if (content.type == InboundMessageType.PING) {
      pingHandler(ws, req, content);
      return;
    }

    if (content.type == InboundMessageType.JOIN_GAME) {
      joinGameHandler(ws, req, content);
      return;
    }

    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Invalid message type." }));
  } catch (e) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Invalid message." }));
  }
};

export default MessageHandlerFactory;