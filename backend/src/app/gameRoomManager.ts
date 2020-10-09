import WebSocket from "ws";
import Timeout = NodeJS.Timeout;
import { PlayerInGame, User } from "../entities/user";
import { OutboundMessageType } from "../websockets/messages";

const PING_TIMEOUT_MS = 3000;

export class GameRoomManager {
  private readonly playersConnections: { [id: string]: { connection: WebSocket; lastPing: number; player: PlayerInGame } };
  private pingTimeout: Timeout;

  constructor() {
    this.playersConnections = {};
    this.pingTimeout = setTimeout(this.removeDisconnectedPlayers, PING_TIMEOUT_MS);
  }

  public addPlayer(client: WebSocket, user: User): void {
    this.playersConnections[user.id] = {
      connection: client,
      lastPing: new Date().getTime(),
      player: { user, correctAnswers: 0 },
    };
  }

  public incrementPlayerCorrectAnswers(id: string): void {
    this.playersConnections[id].player.correctAnswers++;
  }

  public getPlayers(): PlayerInGame[] {
    return Object.keys(this.playersConnections).map((id) => this.playersConnections[id].player);
  }

  public getUsers(): User[] {
    return this.getPlayers().map((p) => p.user);
  }

  public sendMessage(message: Record<string, unknown>, id: string): void {
    try {
      this.playersConnections[id].connection.send(JSON.stringify(message));
    } catch (e) {
      console.log(e);
    }
  }

  public broadcastMessage(message: Record<string, unknown>): void {
    Object.keys(this.playersConnections).forEach((id) => {
      try {
        this.playersConnections[id].connection.send(JSON.stringify(message));
      } catch (e) {
        console.error(e);
      }
    });
  }

  private removeDisconnectedPlayers = (): void => {
    const now = new Date().getTime();
    let hasRemovedPlayers = false;
    Object.keys(this.playersConnections).map((id: string) => {
      if (now - this.playersConnections[id].lastPing > PING_TIMEOUT_MS) {
        this.playersConnections[id].connection.close();
        delete this.playersConnections[id];
        hasRemovedPlayers = true;
      } else {
        this.updateLastPing(id);
      }
    });

    if (hasRemovedPlayers) {
      this.broadcastMessage({
        type: OutboundMessageType.WAITING_ROOM_UPDATE,
        players: this.getUsers(),
      });
    }

    this.pingTimeout = setTimeout(this.removeDisconnectedPlayers, PING_TIMEOUT_MS);
  };

  public disconnectAllPlayers(): void {
    for (const id of Object.keys(this.playersConnections)) {
      this.playersConnections[id].connection.close();
      delete this.playersConnections[id];
    }
  }

  public disconnectUser(id: string): void {
    this.playersConnections[id].connection.close();
    delete this.playersConnections[id];
  }

  public updateLastPing(id: string): void {
    this.playersConnections[id] = {
      ...this.playersConnections[id],
      lastPing: new Date().getTime(),
    };
  }

  public clearPingTimeout(): void {
    if (this.pingTimeout !== undefined) {
      clearTimeout(this.pingTimeout);
    }
  }
}
