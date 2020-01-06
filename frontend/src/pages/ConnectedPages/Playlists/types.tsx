export interface IPlaylist {
  id: string;
  name: string;
  image: string;
}

export interface IData {
  yourPlaylistsRequest: IPlaylist[];
  mostPopularPlaylists: IPlaylist[];
}

export interface IPlaylistRequest {
  data: IData;
  complete: boolean;
  error: boolean;
}
