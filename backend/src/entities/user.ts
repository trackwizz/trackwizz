import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}

/**
 * Class PlayerInGame.
 * This is a User who takes part in a game. Records correct answers in memory.
 */
export class PlayerInGame {
  user: User;
  correctAnswers: number;
}
