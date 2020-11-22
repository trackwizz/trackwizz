import React from "react";

import { IPlaylist } from "../../types";
import PlaylistCard from "../PlaylistCard";
import "../../createGame.css";
import "./playlistContainer.css";

interface IPlaylistContainer {
  title: string;
  playlists: IPlaylist[];
  numberSongs: number;
}

const PlaylistContainer: React.FC<IPlaylistContainer> = ({
  title,
  playlists,
  numberSongs,
}: IPlaylistContainer): JSX.Element => {
  return (
    <div className="sectionContainer">
      <h1>{title}</h1>
      <div className="sectionContentContainer playlists">
        {playlists &&
          playlists.map(el => {
            return <PlaylistCard
              key={el.id}
              playlist={el}
              numberSongs={numberSongs}
            />;
          })}
      </div>
    </div>
  );
};

export default PlaylistContainer;
