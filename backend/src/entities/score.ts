import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Game } from "./game";
import { User } from "./user";

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25 })
  idSpotifyTrack: string;

  @Column({ type: "timestamp" })
  timestamp: Date | null;

  @Column()
  isCorrect: boolean;

  @Column()
  reactionTimeMs: number;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => User)
  user: User;
}
