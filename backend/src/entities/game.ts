import { Entity, PrimaryGeneratedColumn, Column, getRepository } from "typeorm";
import { Track } from "../providers/track";
import Timeout = NodeJS.Timeout;
import { GameRoomManager } from "../app/gameRoomManager";
import { logger } from "../utils/logger";
import { getNRandom, toDate } from "../utils";
import { OutboundMessageType, Player } from "../controllers/websockets_controller";
import gameSessions from "../app/gameSessions";
import { Score } from "./score";
import { User } from "./user";

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
  receivedAnswersForCurrentTrack: Array<Player>;
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
        if (!this.isEmpty()) {
          return;
        }
        this.end();
      }, 10 * 1000);
    }

    if (this.updateTimeout !== undefined) {
      clearTimeout(this.updateTimeout);
    }

    // Mode battle royale
    if (this.mode === 1 && this.currentTrackIndex >= 0) {
      if (await this.kickBadPlayers()) {
        return;
      }
    }

    this.currentTrackIndex += 1;
    while (this.currentTrackIndex < this.tracks.length && this.tracks[this.currentTrackIndex].previewUrl == null) {
      // Skip tracks that don't have a preview URL
      this.currentTrackIndex += 1;
    }
    this.receivedAnswersForCurrentTrack = [];

    if (this.currentTrackIndex >= this.tracks.length) {
      await this.end();
      return;
    }

    this.computeNewPossibleAnswers();

    logger.info(`Game ${this.title} playing ${this.tracks[this.currentTrackIndex].name} at index ${this.currentTrackIndex}. Preview url: ${this.tracks[this.currentTrackIndex].previewUrl}`);

    this.questionStartTimestamp = Date.now();
    this.roomManager.broadcastMessage(this.getQuestionUpdateMessage());

    this.updateTimeout = setTimeout(async () => {
      this.setPlayersMissingScores();
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
   * Update the score for the people who have not answer the question
   */
  public setPlayersMissingScores(): void {
    const players = this.roomManager.getPlayers();
    for (let i = 0; i < players.length; i++) {
      if (!this.receivedAnswersForCurrentTrack.map(p => p.id).includes(players[i].id)) {
        const score: Score = new Score();
        score.idSpotifyTrack = this.tracks[this.currentTrackIndex].id;
        score.timestamp = toDate(Date.now());
        score.isCorrect = false;
        score.reactionTimeMs = 30 * 1000;
        score.game = this;
        score.user = new User();
        score.user.id = players[i].id;

        getRepository(Score).save(score);
      }
    }
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
  public receiveAnswer(player: Player): void {
    this.receivedAnswersForCurrentTrack.push(player);
    if (this.receivedAnswersForCurrentTrack.length >= this.roomManager.getPlayers().length) {
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
    gameSessions.deleteGame(this.id).catch();
    logger.info(`Game ${this.title} ended!`);
  }

  public getKickedNumber(): number {
    const n: number = this.questionsNumber - this.currentTrackIndex;
    const p: number = this.roomManager.getPlayers().length;
    if (n >= p) {
      return 1;
    }
    return Math.min(Math.ceil(p / n), n - 1);
  }

  public async kickBadPlayers(): Promise<boolean> {
    const players = this.roomManager.getPlayers();
    // In case someone left during game and there is only 1 player left.
    if (await this.sendWinMessage()) {
      return true; // end game
    }
    const kickedNumber: number = this.getKickedNumber();
    const scores: Score[] = await getRepository(Score).find({
      where: {
        game: { id: this.id },
        idSpotifyTrack: this.tracks[this.currentTrackIndex].id,
      },
      order: {
        isCorrect: "ASC",
        reactionTimeMs: "DESC",
      },
      relations: ["user"],
    });

    let kicked = 0;
    let i = 0;
    while (kicked < kickedNumber && i < scores.length) {
      const player: Player | null = players.reduce((p1: Player | null, p2: Player) => (p2.id === scores[i].user.id ? p2 : p1), null);
      if (player !== null) {
        this.roomManager.sendMessage(
          {
            type: OutboundMessageType.BATTLE_LOSE,
            gameId: this.id,
            position: this.roomManager.getPlayers().length,
          },
          player.id,
        );
        this.roomManager.disconnectUser(player.id);
        kicked += 1;
      }
      i += 1;
    }

    // If there is only 1 player left after kicks, send him win message.
    return await this.sendWinMessage();
  }

  public async sendWinMessage(): Promise<boolean> {
    const players = this.roomManager.getPlayers();
    if (players.length === 1) {
      this.roomManager.sendMessage(
        {
          type: OutboundMessageType.BATTLE_WIN,
          gameId: this.id,
        },
        players[0].id,
      );
      this.roomManager.disconnectUser(players[0].id);
      await this.end();
      return true;
    }
    return false;
  }
}
