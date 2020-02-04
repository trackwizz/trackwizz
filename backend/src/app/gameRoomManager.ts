import WebSocket from "ws";
import { OutboundMessageType } from "../controllers/websockets_controller";
import Timeout = NodeJS.Timeout;

const PING_TIMEOUT_MS = 3000;

export class GameRoomManager {
  private readonly playersConnections: { [origin: string]: { connection: WebSocket; lastPing: number } };
  private pingTimeout: Timeout;

  constructor() {
    this.playersConnections = {};
    this.pingTimeout = setTimeout(this.removeDisconnectedPlayers, PING_TIMEOUT_MS);
  }

  public addPlayer(origin: string, client: WebSocket): void {
    this.playersConnections[origin] = {
      connection: client,
      lastPing: new Date().getTime(),
    };
  }

  public getPlayers(): string[] {
    return Object.keys(this.playersConnections);
  }

  public broadcastMessage(message: object): void {
    Object.keys(this.playersConnections).forEach(origin => {
      try {
        this.playersConnections[origin].connection.send(JSON.stringify(message));
      } catch (e) {
        console.error(e);
      }
    });
  }

  private removeDisconnectedPlayers = (): void => {
    const now = new Date().getTime();
    let hasRemovedPlayers = false;
    Object.keys(this.playersConnections).map((origin: string) => {
      if (now - this.playersConnections[origin].lastPing > PING_TIMEOUT_MS) {
        this.playersConnections[origin].connection.close();
        delete this.playersConnections[origin];
        hasRemovedPlayers = true;
      } else {
        this.updateLastPing(origin);
      }
    });

    if (hasRemovedPlayers) {
      this.broadcastMessage({
        type: OutboundMessageType.WAITING_ROOM_UPDATE,
        players: this.getPlayers(),
      });
    }

    this.pingTimeout = setTimeout(this.removeDisconnectedPlayers, PING_TIMEOUT_MS);
  };

  public disconnectAllPlayers(): void {
    for (const origin of Object.keys(this.playersConnections)) {
      this.playersConnections[origin].connection.close();
      delete this.playersConnections[origin];
    }
  }

  public updateLastPing(origin: string): void {
    this.playersConnections[origin] = {
      ...this.playersConnections[origin],
      lastPing: new Date().getTime(),
    };
  }

  public clearPingTimeout(): void {
    if (this.pingTimeout !== undefined) {
      clearTimeout(this.pingTimeout);
    }
  }
}