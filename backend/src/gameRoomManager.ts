import WebSocket from "ws";

const PING_TIMEOUT_MS = 10000;

export class GameRoomManager {
  private readonly playersConnections: { [origin: string]: { connection: WebSocket; lastPing: number } };

  constructor() {
    this.playersConnections = {};
    setTimeout(this.removeDisconnectedPlayers, PING_TIMEOUT_MS);
  }

  addPlayer = (origin: string, client: WebSocket): void => {
    this.playersConnections[origin] = {
      connection: client,
      lastPing: new Date().getTime(),
    };
  };

  getPlayers = (): string[] => Object.keys(this.playersConnections);

  broadcastMessage = (message: object): void => {
    Object.keys(this.playersConnections).forEach(origin => this.playersConnections[origin].connection.send(JSON.stringify(message)));
  };

  private removeDisconnectedPlayers = (): void => {
    const now = new Date().getTime();
    Object.keys(this.playersConnections).map((origin: string) => {
      if (now - this.playersConnections[origin].lastPing > PING_TIMEOUT_MS) {
        delete this.playersConnections[origin];
      } else {
        this.updateLastPing(origin);
      }
    });

    setTimeout(this.removeDisconnectedPlayers, PING_TIMEOUT_MS);
  };

  updateLastPing = (origin: string): void => {
    this.playersConnections[origin] = {
      ...this.playersConnections[origin],
      lastPing: new Date().getTime(),
    };
  };
}