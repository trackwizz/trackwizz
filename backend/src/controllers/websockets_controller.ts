import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";
import { Score } from "../entities/score";
import { getRepository } from "typeorm";
import { toDate } from "../utils";
import { User } from "../entities/user";

export enum InboundMessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
  REQUEST_START_GAME = "REQUEST_START_GAME",
  SUBMIT_ANSWER = "SUBMIT_ANSWER",
}

export enum OutboundMessageType {
  WAITING_ROOM_UPDATE = "WAITING_ROOM_UPDATE",
  QUESTION_UPDATE = "QUESTION_UPDATE",
  START_GAME = "START_GAME",
  ANSWER_RESULT = "ANSWER_RESULT",
  GAME_END = "GAME_END",
  ERROR = "ERROR",
  BATTLE_LOSE = "BATTLE_LOSE",
  BATTLE_WIN = "BATTLE_WIN",
}

export interface Player {
  id: string;
  name: string;
}

/* --- Ping --- */
type PingMessage = {
  type: InboundMessageType.PING;
  gameId: number;
  player: Player;
};

const pingHandler = (ws: WebSocket, req: RequestWithCache, { gameId, player }: PingMessage): void => {
  const game = req.gameSessions.getGame(gameId);

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found" }));
    return;
  }

  game.roomManager.updateLastPing(player.id);
};

/* --- Join game --- */
type JoinGameMessage = {
  type: InboundMessageType.JOIN_GAME;
  gameId: number;
  player: Player;
};

const joinGameHandler = (ws: WebSocket, req: RequestWithCache, { gameId, player }: JoinGameMessage): void => {
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
};

/* --- Start game --- */
type StartGameMessage = {
  type: InboundMessageType.REQUEST_START_GAME;
  gameId: string;
};

/**
 * Countdown at the start of the game before sending the first track to the frontend.
 */
const START_GAME_COUNTDOWN_MS = 3000;

const startGameHandler = (ws: WebSocket, req: RequestWithCache, { gameId }: StartGameMessage): void => {
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
};

/* --- Submit Answer --- */
type Answer = {
  id: string;
  name: string;
  artist: string;
};

type SubmitAnswerMessage = {
  type: InboundMessageType.SUBMIT_ANSWER;
  answer: Answer;
  gameId: string;
  player: Player;
};

const SubmitAnswerHandler = (ws: WebSocket, req: RequestWithCache, { answer, gameId, player }: SubmitAnswerMessage): void => {
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

  getRepository(Score)
    .save(score)
    .then((): void => {
      game.receiveAnswer(player);
    })
    .catch((e): void => {
      console.log(e);
    });

  ws.send(JSON.stringify({ type: OutboundMessageType.ANSWER_RESULT, isCorrect: score.isCorrect }));
};

/* --- Root handler --- */
const MessageHandlerFactory = (ws: WebSocket, req: RequestWithCache) => (msg: string): void => {
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

export default MessageHandlerFactory;
