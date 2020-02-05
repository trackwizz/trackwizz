import { Game } from "../entities/game";

export class GameSessions {
  private readonly games: { [key: number]: Game };

  constructor() {
    this.games = {};
  }

  public addGame(game: Game): void {
    this.games[game.id] = game;
  }

  public getGame(id: number): Game | undefined {
    return this.games[id];
  }

  public async deleteGame(id: number): Promise<void> {
    const game: Game | undefined = this.games[id];
    if (game === undefined) {
      return;
    }
    delete this.games[id];
  }
}

const gameSessions = new GameSessions();
export default gameSessions;
