import { Game } from "./entities/game";
import { logger } from "./utils/logger";
import { getRepository } from "typeorm";
import { getNRandom } from "./utils";
import { OutboundMessageType } from "./controllers/websockets_controller";
import { Track } from "./providers/track";

class Answer {
  public id: string;
  public name: string;
  public artist: string;
}

export class GameSessions {
  private readonly games: { [key: string]: Game };

  constructor() {
    this.games = {};
  }

  public new(game: Game): void {
    this.games[game.id] = game;
    this.startGame(game.id.toString());
  }

  public startGame(id: string): void {
    if (this.games[id] === undefined) {
      return;
    }
    const game = this.games[id];
    const now: number = new Date().getTime();
    const remainingTime: number = game.startDate.getTime() - now;
    if (remainingTime > 0) {
      setTimeout(async () => {
        logger.info(`Game ${game.id} is starting !`);
        await this.updateGame(id);
      }, remainingTime);
    }
  }

  public async updateGame(id: string): Promise<void> {
    if (this.games[id] === undefined) {
      return;
    }
    const game = this.games[id];
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

    const answersIndexes: number[] = game.otherTracksIndexes.concat([game.currentTrackIndex]);
    const answers: Answer[] = answersIndexes.map((index: number) => game.tracks[index]).map((track: Track) => ({ id: track.id, name: track.name, artist: track.artist }));

    logger.info(`Game ${game.title} playing ${game.tracks[game.currentTrackIndex].name} at index ${game.currentTrackIndex}!`);
    logger.info(`All guesses: ${JSON.stringify(answers)}`);

    game.roomManager.broadcastMessage({
      type: OutboundMessageType.QUESTION_UPDATE,
      previewUrl: game.tracks[game.currentTrackIndex].previewUrl,
      answers,
    });

    game.updateTimeout = setTimeout(async () => {
      await this.updateGame(id);
    }, 30 * 1000);
  }

  public getGame(id: string): Game | undefined {
    return this.games[id];
  }
}
