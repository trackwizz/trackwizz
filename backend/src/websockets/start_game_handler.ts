import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";
import { InboundMessageType, OutboundMessageType } from "./messages";

const START_GAME_COUNTDOWN_MS = 3000; // Countdown at the start of the game before sending the first track to the frontend.

type StartGameMessage = {
  type: InboundMessageType.REQUEST_START_GAME;
  gameId: string;
};

/**
 * Called when a user wants to start a game.
 * @param ws: Express-ws websocket object
 * @param req: Express request object
 * @param gameId: number, game id
 */
export function startGameHandler(ws: WebSocket, req: RequestWithCache, { gameId }: StartGameMessage): void {
  const game = req.gameSessions.getGame(parseInt(gameId));

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found." }));
    return;
  }

  if (game.startDate.getTime() === 0) {
    // Game hasn't started

    setTimeout(() => game.start(), START_GAME_COUNTDOWN_MS);

    game.roomManager.broadcastMessage({
      type: OutboundMessageType.START_GAME,
      countdownMs: START_GAME_COUNTDOWN_MS,
    });
  } else {
    // Game has started, returning the current question to the newcomer, without affecting the other players
    ws.send(
      JSON.stringify({
        type: OutboundMessageType.START_GAME,
        countdownMs: START_GAME_COUNTDOWN_MS,
      }),
    );
    setTimeout(() => ws.send(JSON.stringify(game.getQuestionUpdateMessage())), START_GAME_COUNTDOWN_MS);
  }
}
