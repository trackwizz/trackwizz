import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";
import { InboundMessageType, OutboundMessageType } from "./messages";
import { pingHandler } from "./ping_handler";
import { joinGameHandler } from "./join_game_handler";
import { startGameHandler } from "./start_game_handler";
import { SubmitAnswerHandler } from "./submit_answer_handler";

/**
 * Websocket root handler. Redirects the websocket message to the corresponding function handler.
 *
 * @param ws: Express-ws websocket object
 * @param req: Express request object
 */
function MessageHandlerFactory(ws: WebSocket, req: RequestWithCache) {
  return function (msg: string): void {
    try {
      const content = JSON.parse(msg);

      switch (content.type) {
        case InboundMessageType.PING:
          pingHandler(ws, req, content);
          break;
        case InboundMessageType.JOIN_GAME:
          joinGameHandler(ws, req, content);
          break;
        case InboundMessageType.REQUEST_START_GAME:
          startGameHandler(ws, req, content);
          break;
        case InboundMessageType.SUBMIT_ANSWER:
          SubmitAnswerHandler(ws, req, content);
          break;
        default:
          ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Invalid message type." }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Invalid message." }));
    }
  };
}

export default MessageHandlerFactory;
