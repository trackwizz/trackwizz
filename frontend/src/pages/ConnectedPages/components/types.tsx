export interface ITrack {
  id: string;
  name: string;
  previewUrl: string;
  trackNumber: number;
  artist: string;
}

export interface IRoom {
  id: number;
  startDate: Date;
  isEnded: boolean;
  score: number;
  title: string;
  questionsNumber: number;
  isPublic: boolean;
  mode: number;
  idSpotifyPlaylist: string;
  tracks: ITrack[];
  currentTrackIndex: number;
  otherTracksIndexes: number[];
  updateTimeout: any;
}
