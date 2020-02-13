import React from "react";

import { IPlaylist } from "../../types";
import PlaylistCard from "../PlaylistCard";
import "./playlistContainer.css";

interface IPlaylistContainer {
  title: string;
  playlists: IPlaylist[];
}

const PlaylistContainer: React.FC<IPlaylistContainer> = ({
  title,
  playlists
}: IPlaylistContainer): JSX.Element => {
  return (
    <div className="playlistContainer">
      <h1 className="playlistsTitle">{title}</h1>
      <div className="playlists">
        {playlists &&
          playlists.map(el => {
            return <PlaylistCard key={el.id} playlist={el} />;
          })}
      </div>
    </div>
  );
};

export default PlaylistContainer;
