import { Game } from "./entities/game";
import { logger } from "./utils/logger";
import { getRepository } from "typeorm";

export class GameSessions {
  private readonly games: { [key: number]: Game };

  constructor() {
    this.games = {};
  }

  public new(game: Game): void {
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
    if (!game.isEmpty()) {
      return;
    }
    game.isEnded = true;
    await getRepository(Game).save(game);
    logger.info(`Game ${game.title} ended!`);
    if (game.updateTimeout !== undefined) {
      clearTimeout(game.updateTimeout);
    }
    game.roomManager.clearPingTimeout();
    delete this.games[id];
  }
}

const gameSessions = new GameSessions();
export default gameSessions;
