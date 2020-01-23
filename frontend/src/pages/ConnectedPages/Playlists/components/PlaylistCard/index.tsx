import React, { useState } from "react";

import { IPlaylist } from "../../types";
import "./playlistCard.css";
import { Redirect } from "react-router-dom";
import { axiosRequest } from "../../../components/axiosRequest";
import { Method } from "axios";
import { IRoom } from "../../../components/types";

interface IProps {
  playlist: IPlaylist;
}

const PlaylistCard: React.FC<IProps> = ({ playlist }: IProps) => {
  const [newRoom, setNewRoom] = useState<null | IRoom>(null);

  const handleRedirection = async () => {
    const requestNewRoom = {
      data: {
        idSpotifyPlaylist: playlist.id
      },
      method: "POST" as Method,
      url: "/games"
    };
    const responseNewRoom = await axiosRequest(requestNewRoom);
    console.log(playlist.id);

    if (responseNewRoom.complete && !responseNewRoom.error) {
      setNewRoom(responseNewRoom.data as IRoom);
    }
  };

  if (newRoom) {
    // TODO post to add game in backend, retrieve game id.
    // TODO connect to game via websocket using game id.
    return <Redirect to={`/waitingRoom?playlist=${newRoom.id}`} />;
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
