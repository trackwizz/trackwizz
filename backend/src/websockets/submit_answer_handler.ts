import WebSocket from "ws";
import { getRepository } from "typeorm";
import { RequestWithCache } from "../middlewares/app_cache";
import { Score } from "../entities/score";
import { toDate } from "../utils";
import { User } from "../entities/user";
import { InboundMessageType, OutboundMessageType } from "./messages";

type Answer = {
  id: string;
  name: string;
  artist: string;
};

type SubmitAnswerMessage = {
  type: InboundMessageType.SUBMIT_ANSWER;
  answer: Answer;
  gameId: string;
  player: User;
};

/**
 * Called when a user sends an answer.
 * @param ws: Express-ws websocket object
 * @param req: Express request object
 * @param answer: Answer
 * @param gameId: number, game id
 * @param player: User
 */
export function SubmitAnswerHandler(ws: WebSocket, req: RequestWithCache, { answer, gameId, player }: SubmitAnswerMessage): void {
  const game = req.gameSessions.getGame(parseInt(gameId));

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found." }));
    return;
  }

  const score: Score = new Score();
  score.idSpotifyTrack = game.tracks[game.currentTrackIndex].id;
  score.timestamp = toDate(Date.now());
  score.isCorrect = answer.id == game.tracks[game.currentTrackIndex].id;
  score.reactionTimeMs = Date.now() - game.questionStartTimestamp;
  score.game = game;
  score.user = new User();
  score.user.id = player.id;

  if (score.isCorrect) {
    game.roomManager.incrementPlayerCorrectAnswers(player.id);
  }

  getRepository(Score)
    .save(score)
    .then((): void => {
      game.receiveAnswer(player);
    })
    .catch((e): void => {
      console.log(e);
    });

  ws.send(JSON.stringify({ type: OutboundMessageType.ANSWER_RESULT, isCorrect: score.isCorrect }));
}
