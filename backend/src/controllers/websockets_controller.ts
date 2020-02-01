import WebSocket from "ws";
import { RequestWithCache } from "../middlewares/app_cache";
import { Score } from "../entities/score";
import { getRepository } from "typeorm";
import { toDate } from "../utils";
import { getSpotifyUser, SpotifyUser } from "../providers/spotify/user";
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
  RECORDED_ANSWER = "RECORDED_ANSWER",
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
  gameId: number;
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
  gameId: number;
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

  setTimeout(() => req.gameSessions.startGame(game.id), START_GAME_COUNTDOWN_MS);

  game.roomManager.broadcastMessage({
    type: OutboundMessageType.START_GAME,
    countdownMs: START_GAME_COUNTDOWN_MS,
  });
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
  accessToken: string;
};

const SubmitAnswerHandler = (ws: WebSocket, req: RequestWithCache, { answer, gameId, accessToken }: SubmitAnswerMessage): void => {
  const game = req.gameSessions.getGame(parseInt(gameId));

  if (!game) {
    ws.send(JSON.stringify({ type: OutboundMessageType.ERROR, message: "Game not found." }));
    return;
  }

  getSpotifyUser(accessToken)
    .then((spotifyUser: SpotifyUser) => {
      const score: Score = new Score();
      score.idSpotifyTrack = answer.id;
      score.timestamp = toDate(Date.now());
      score.isCorrect = answer.id == game.tracks[game.currentTrackIndex].id;
      score.reactionTimeMs = Date.now() - game.questionStartTimestamp;
      score.game = game;
      score.user = new User();
      score.user.id = spotifyUser.id;

      getRepository(Score).save(score);

      ws.send(JSON.stringify({ type: OutboundMessageType.RECORDED_ANSWER, isCorrect: score.isCorrect }));
    })
    .catch(() => {
      console.error("Can't find Spotify user to add score");
    });
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
