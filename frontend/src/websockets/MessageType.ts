enum MessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
  QUESTION_UPDATE = "QUESTION_UPDATE",
  WAITING_ROOM_UPDATE = "WAITING_ROOM_UPDATE",
  START_GAME = "START_GAME",
  REQUEST_START_GAME = "REQUEST_START_GAME",
  SUBMIT_ANSWER = "SUBMIT_ANSWER"
}

export interface Answer {
  id: string;
  name: string;
  artist: string;
}

export interface WaitingRoomUpdateMessage {
  type: MessageType.WAITING_ROOM_UPDATE;
  players: string[];
}

export interface QuestionUpdateMessage {
  type: MessageType.QUESTION_UPDATE;
  previewUrl: string;
  answers: Answer[];
}

export interface SubmitAnswerMessage {
  type: MessageType.SUBMIT_ANSWER;
  answer: Answer;
  gameId: string;
  accessToken: string;
}

export interface GameStartMessage {
  type: MessageType.START_GAME;
  countdownMs: number;
}

export default MessageType;
