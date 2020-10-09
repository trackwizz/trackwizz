enum MessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
  QUESTION_UPDATE = "QUESTION_UPDATE",
  WAITING_ROOM_UPDATE = "WAITING_ROOM_UPDATE",
  START_GAME = "START_GAME",
  REQUEST_START_GAME = "REQUEST_START_GAME",
  SUBMIT_ANSWER = "SUBMIT_ANSWER",
  ANSWER_RESULT = "ANSWER_RESULT",
  GAME_END = "GAME_END",
  BATTLE_LOSE = "BATTLE_LOSE",
  BATTLE_WIN = "BATTLE_WIN"
}

export interface Player {
  id: string;
  name: string;
}

export interface PlayerInGame {
  userName: string;
  correctAnswers: number;
}

export interface Answer {
  id: string;
  name: string;
  artist: string;
}

export interface WaitingRoomUpdateMessage {
  type: MessageType.WAITING_ROOM_UPDATE;
  players: Player[];
  gameMode: 0 | 1;
}

export interface QuestionUpdateMessage {
  type: MessageType.QUESTION_UPDATE;
  previewUrl: string;
  answers: Answer[];
  playersNumber: number;
  playersInGame: PlayerInGame[];
}

export interface SubmitAnswerMessage {
  type: MessageType.SUBMIT_ANSWER;
  answer: Answer;
  gameId: string;
  accessToken: string;
}

export interface AnswerResultMessage {
  type: MessageType.ANSWER_RESULT;
  isCorrect: boolean;
}

export interface GameStartMessage {
  type: MessageType.START_GAME;
  countdownMs: number;
}

export interface GameEndMessage {
  type: MessageType.GAME_END;
  gameId: string;
}

export interface GameBattleLoseMessage {
  type: MessageType.BATTLE_LOSE;
  gameId: string;
  position: number;
}

export interface GameBattleWinMessage {
  type: MessageType.BATTLE_WIN;
  gameId: string;
}

export default MessageType;
