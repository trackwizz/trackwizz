import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Track } from "../providers/track";
import Timeout = NodeJS.Timeout;
import { GameRoomManager } from "../gameRoomManager";

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
  updateTimeout: Timeout;
  questionStartTimestamp: number;
  answersForCurrentTrack: number;

  roomManager: GameRoomManager;
}
