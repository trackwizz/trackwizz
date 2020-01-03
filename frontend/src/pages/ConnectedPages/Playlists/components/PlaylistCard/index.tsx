import React, { useState } from "react";

import { IPlaylist } from "../../types";
import "./playlistCard.css";
import { Redirect } from "react-router-dom";

interface IProps {
  playlist: IPlaylist;
}

const PlaylistCard: React.FC<IProps> = ({ playlist }: IProps) => {
  const [hasToRedirect, setHasToRedirect] = useState(false);

  const handleRedirection = () => {
    setHasToRedirect(true);
  };

  if (hasToRedirect) {
    return <Redirect to={`/waitingRoom?${playlist.id}`} />;
  }

  return (
    <div
      className="playlistCard"
      style={{
        backgroundImage: `url(${playlist.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
      onClick={handleRedirection}
    >
      <h3 className="playlistTitle">{playlist.name}</h3>
    </div>
  );
};

export default PlaylistCard;
