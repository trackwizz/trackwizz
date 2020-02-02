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
  private readonly games: { [key: number]: Game };

  constructor() {
    this.games = {};
  }

  public new(game: Game): void {
    this.games[game.id] = game;
  }

  public async startGame(id: number): Promise<void> {
    if (this.games[id] === undefined) {
      return;
    }
    await this.updateGame(id);
  }

  public async updateGame(id: number): Promise<void> {
    if (this.games[id] === undefined) {
      return;
    }
    const game = this.games[id];
    if (game.updateTimeout !== undefined) {
      clearTimeout(game.updateTimeout);
    }

    game.currentTrackIndex += 1;
    while (game.currentTrackIndex < game.tracks.length && game.tracks[game.currentTrackIndex].previewUrl == null) {
      // Skip tracks that don't have a preview URL
      game.currentTrackIndex += 1;
    }
    game.receivedAnswersForCurrentTrack = 0;

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

    // Make an array with the indexes of the 4 tracks
    const answersIndexes: number[] = game.otherTracksIndexes.concat([game.currentTrackIndex]);
    // Get the actual answers
    // Step 1: get the tracks data
    // Step 2: keep only id, name and artist
    // Step 3: shuffle the answers
    const answers: Answer[] = getNRandom(
      answersIndexes.map((index: number) => game.tracks[index]).map((track: Track) => ({ id: track.id, name: track.name, artist: track.artist })),
      4,
    );

    logger.info(`Game ${game.title} playing ${game.tracks[game.currentTrackIndex].name} at index ${game.currentTrackIndex}. Preview url: ${game.tracks[game.currentTrackIndex].previewUrl}`);
    logger.info(`All guesses: ${JSON.stringify(answers)}`);

    game.questionStartTimestamp = Date.now();
    game.roomManager.broadcastMessage({
      type: OutboundMessageType.QUESTION_UPDATE,
      previewUrl: game.tracks[game.currentTrackIndex].previewUrl,
      answers,
    });

    game.updateTimeout = setTimeout(async () => {
      await this.updateGame(id);
    }, 30 * 1000);
  }

  public receiveAnswer(id: number): void {
    if (this.games[id] === undefined) {
      return;
    }

    const game = this.games[id];

    game.receivedAnswersForCurrentTrack += 1;
    if (game.receivedAnswersForCurrentTrack >= game.roomManager.getPlayers().length) {
      // Wait for 3 seconds before switching to the next track
      if (game.updateTimeout !== undefined) {
        clearTimeout(game.updateTimeout);
      }
      game.updateTimeout = setTimeout(async () => {
        await this.updateGame(id);
      }, 3 * 1000);
    }
  }

  public getGame(id: number): Game | undefined {
    return this.games[id];
  }
}
