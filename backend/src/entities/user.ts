import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ default: null })
  country: string;

  @Column()
  name: string;
}
