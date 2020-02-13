import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";
import { InboundMessageType, OutboundMessageType } from "./messages";
import { User } from "../entities/user";

type PingMessage = {
  type: InboundMessageType.PING;
  gameId: number;
  player: User;
};

/**
 * Receives ping from client who is still connected.
 * @param ws: Express-ws websocket object
 * @param req: Express request object
 * @param gameId: number, game id
 * @param player: Player
 */
export function pingHandler(ws: WebSocket, req: RequestWithCache, { gameId, player }: PingMessage): void {
  const game = req.gameSessions.getGame(gameId);

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found" }));
    return;
  }

  game.roomManager.updateLastPing(player.id);
}
