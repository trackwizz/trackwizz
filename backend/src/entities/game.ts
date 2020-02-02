import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Track } from "../providers/track";
import Timeout = NodeJS.Timeout;
import { GameRoomManager } from "../gameRoomManager";

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

  /* local data during game */
  tracks: Array<Track>;
  currentTrackIndex: number;
  otherTracksIndexes: Array<number>;
  currentPossibleAnswers: Array<Answer>;
  updateTimeout: Timeout;
  questionStartTimestamp: number;
  receivedAnswersForCurrentTrack: number;

  roomManager: GameRoomManager;
}
