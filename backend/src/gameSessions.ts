import { Game } from "./entities/game";
import { logger } from "./utils/logger";
import { getRepository } from "typeorm";
import { getNRandom } from "./utils";

export class GameSessions {
  private readonly games: { [key: string]: Game };

  constructor() {
    this.games = {};
  }

  public new(game: Game): void {
    this.games[game.title] = game;
    this.startGame(game.title);
  }

  public startGame(title: string): void {
    if (this.games[title] === undefined) {
      return;
    }
    const game = this.games[title];
    const now: number = new Date().getTime();
    const remainingTime: number = game.startDate.getTime() - now;
    if (remainingTime > 0) {
      setTimeout(async () => {
        logger.info(`Game ${game.title} is starting !`);
        await this.updateGame(title);
      }, remainingTime);
    }
  }

  public async updateGame(title: string): Promise<void> {
    if (this.games[title] === undefined) {
      return;
    }
    const game = this.games[title];
    if (game.updateTimeout !== undefined) {
      clearTimeout(game.updateTimeout);
    }

    game.currentTrackIndex += 1;
    if (game.currentTrackIndex >= game.tracks.length) {
      game.isEnded = true;
      await getRepository(Game).save(game);
      logger.info(`Game ${game.title} ended!`);
      // todo send game-end websocket to game room
      return;
    }

    const otherTracksIndexes = Array.from(Array(game.questionsNumber).keys());
    otherTracksIndexes.splice(game.currentTrackIndex, 1);
    game.otherTracksIndexes = getNRandom(otherTracksIndexes, 3);
    logger.info(`Game ${game.title} playing ${game.tracks[game.currentTrackIndex].name} at index ${game.currentTrackIndex}!`);
    logger.info(`Other guess: ${JSON.stringify(game.otherTracksIndexes)}`);
    // todo send game-update websocket to game room

    game.updateTimeout = setTimeout(async () => {
      await this.updateGame(title);
    }, 30 * 1000);
  }
}
