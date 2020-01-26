enum MessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
  QUESTION_UPDATE = "QUESTION_UPDATE",
  WAITING_ROOM_UPDATE = "WAITING_ROOM_UPDATE"
}
interface Answer {
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

export default MessageType;
