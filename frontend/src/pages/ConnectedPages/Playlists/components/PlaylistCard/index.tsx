<<<<<<< HEAD
import React, { useState } from "react";

import { IPlaylist } from "../../types";
import "./playlistCard.css";
import { Redirect } from "react-router-dom";
=======
import React from "react";

import { IPlaylist } from "../../types";
import "./playlistCard.css";
>>>>>>> Add selection playlist

interface IProps {
  playlist: IPlaylist;
}

const PlaylistCard: React.FC<IProps> = ({ playlist }: IProps) => {
<<<<<<< HEAD
  const [hasToRedirect, setHasToRedirect] = useState(false);

  const handleRedirection = () => {
    setHasToRedirect(true);
  };

  if (hasToRedirect) {
    return <Redirect to={`/waitingRoom?${playlist.id}`} />;
  }

=======
>>>>>>> Add selection playlist
  return (
    <div
      className="playlistCard"
      style={{
        backgroundImage: `url(${playlist.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
<<<<<<< HEAD
      onClick={handleRedirection}
=======
>>>>>>> Add selection playlist
    >
      <h3 className="playlistTitle">{playlist.name}</h3>
    </div>
  );
};

export default PlaylistCard;
