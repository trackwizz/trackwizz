import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Game {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startDate: Date | null;

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

  @Column({ type: 'smallint' })
  mode: number;

  @Column({ length: 25 })
  idSpotify: string;
}
