import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}

export class UserInGame {
  user: User;
  correctAnswers: number;
}
