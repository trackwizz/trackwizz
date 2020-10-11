import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}

/**
 * Class UserInGame.
 * This is a User who takes part in a game. Records correct answers in memory.
 */
export class UserInGame {
  user: User;
  correctAnswers: number;
}
