enum MessageType {
  PING = "PING",
  JOIN_GAME = "JOIN_GAME",
  WAITING_ROOM_UPDATE = "WAITING_ROOM_UPDATE"
}

export interface WaitingRoomUpdateMessage {
  type: MessageType.WAITING_ROOM_UPDATE;
  players: string[];
}

export default MessageType;
