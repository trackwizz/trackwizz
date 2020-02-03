import { Entity, PrimaryGeneratedColumn, Column, getRepository } from "typeorm";
import { Track } from "../providers/track";
import Timeout = NodeJS.Timeout;
import { GameRoomManager } from "../app/gameRoomManager";
import { logger } from "../utils/logger";
import { getNRandom } from "../utils";
import { OutboundMessageType } from "../controllers/websockets_controller";
import gameSessions from "../app/gameSessions";

export class Answer {
  public id: string;
  public name: string;
  public artist: string;
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column()
  isEnded: boolean;

  @Column()
  score: number;

  @Column({ length: 50 })
  title: string;

  @Column()
  questionsNumber: number;

  @Column()
  isPublic: boolean;

  @Column({ type: "smallint" })
  mode: number;

  @Column({ length: 25 })
  idSpotifyPlaylist: string;

  /* Local data during game */
  tracks: Array<Track>;
  currentTrackIndex: number;
  otherTracksIndexes: Array<number>;
  currentPossibleAnswers: Array<Answer>;
  updateTimeout: Timeout;
  questionStartTimestamp: number;
  receivedAnswersForCurrentTrack: number;
  roomManager: GameRoomManager;

  /**
   * Starts a game.
   */
  public async start(): Promise<void> {
    this.startDate = new Date();
    await getRepository(Game).save(this);
    await this.update();
  }

  /**
   * Updates a game to the next questions.
   */
  public async update(): Promise<void> {
    // Delete game after 10s without users.
    if (this.isEmpty()) {
      setTimeout(() => {
        gameSessions.deleteGame(this.id).catch();
      }, 10 * 1000);
    }

    if (this.updateTimeout !== undefined) {
      clearTimeout(this.updateTimeout);
    }

    this.currentTrackIndex += 1;
    while (this.currentTrackIndex < this.tracks.length && this.tracks[this.currentTrackIndex].previewUrl == null) {
      // Skip tracks that don't have a preview URL
      this.currentTrackIndex += 1;
    }
    this.receivedAnswersForCurrentTrack = 0;

    if (this.currentTrackIndex >= this.tracks.length) {
      await this.end();
      return;
    }

    this.computeNewPossibleAnswers();

    logger.info(`Game ${this.title} playing ${this.tracks[this.currentTrackIndex].name} at index ${this.currentTrackIndex}. Preview url: ${this.tracks[this.currentTrackIndex].previewUrl}`);

    this.questionStartTimestamp = Date.now();
    this.roomManager.broadcastMessage(this.getQuestionUpdateMessage());

    this.updateTimeout = setTimeout(async () => {
      await this.update();
    }, 30 * 1000);
  }

  /**
   * Save random responses among the correct answer.
   */
  public computeNewPossibleAnswers(): void {
    const otherTracksIndexes = Array.from(Array(this.questionsNumber).keys());
    otherTracksIndexes.splice(this.currentTrackIndex, 1);
    this.otherTracksIndexes = getNRandom(otherTracksIndexes, 3);

    // Make an array with the indexes of the 4 tracks
    const answersIndexes: number[] = this.otherTracksIndexes.concat([this.currentTrackIndex]);
    // Get the actual answers
    // Step 1: get the tracks data
    // Step 2: keep only id, name and artist
    // Step 3: shuffle the answers
    this.currentPossibleAnswers = getNRandom(
      answersIndexes.map((index: number) => this.tracks[index]).map((track: Track) => ({ id: track.id, name: track.name, artist: track.artist })),
      4,
    );
  }

  /**
   * Returns the data for the frontend: 4 possible answers and one preview url (audio to play).
   */
  public getQuestionUpdateMessage(): { type: string; previewUrl: string; answers: Answer[] } {
    return {
      type: OutboundMessageType.QUESTION_UPDATE,
      previewUrl: this.tracks[this.currentTrackIndex].previewUrl,
      answers: this.currentPossibleAnswers,
    };
  }

  /**
   * Returns true if there are no more users in the game room.
   */
  public isEmpty(): boolean {
    return this.roomManager.getPlayers().length === 0;
  }

  /**
   * Get an answer from one user, check it and save it.
   */
  public receiveAnswer(): void {
    this.receivedAnswersForCurrentTrack += 1;
    if (this.receivedAnswersForCurrentTrack >= this.roomManager.getPlayers().length) {
      // Wait for 3 seconds before switching to the next track
      if (this.updateTimeout !== undefined) {
        clearTimeout(this.updateTimeout);
      }
      this.updateTimeout = setTimeout(async () => {
        await this.update();
      }, 3 * 1000);
    }
  }

  public async end(): Promise<void> {
    this.isEnded = true;
    await getRepository(Game).save(this);
    // Stop update events
    if (this.updateTimeout !== undefined) {
      clearTimeout(this.updateTimeout);
    }
    // Send end game message to users
    this.roomManager.broadcastMessage({
      type: OutboundMessageType.GAME_END,
      gameId: this.id,
    });
    // Remove ping timeout events
    this.roomManager.clearPingTimeout();
    // Disconnect all users
    this.roomManager.disconnectAllPlayers();
    logger.info(`Game ${this.title} ended!`);
  }
}
