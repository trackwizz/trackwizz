export enum IGameEnum {
  "COUNTDOWN",
  "QUIZZ",
  "SCORE"
}

export interface ITrack {
  track: string;
  choices: string[];
}

export interface ITraksRequest {
  data: ITrack[];
  complete: boolean;
  error: boolean;
}
