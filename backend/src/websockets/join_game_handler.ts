import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";
import { InboundMessageType, OutboundMessageType } from "./messages";
import { User } from "../entities/user";

type JoinGameMessage = {
  type: InboundMessageType.JOIN_GAME;
  gameId: number;
  player: User;
};

/**
 * Called when a user wants to join a game.
 * @param ws: Express-ws websocket object
 * @param req: Express request object
 * @param gameId: number, game id
 * @param player: User
 */
export function joinGameHandler(ws: WebSocket, req: RequestWithCache, { gameId, player }: JoinGameMessage): void {
  const game = req.gameSessions.getGame(gameId);

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found." }));
    return;
  }

  game.roomManager.addPlayer(ws, player);

  game.roomManager.broadcastMessage({
    type: OutboundMessageType.WAITING_ROOM_UPDATE,
    players: game.roomManager.getPlayers(),
  });
}
