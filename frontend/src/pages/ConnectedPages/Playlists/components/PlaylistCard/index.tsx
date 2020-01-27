import React, { useState } from "react";

import { IPlaylist } from "../../types";
import "./playlistCard.css";
import { Redirect } from "react-router-dom";
import { axiosRequest } from "../../../components/axiosRequest";
import { Method } from "axios";
import { IRoom } from "../../../components/types";
import ConnectionManager from "../../../../../websockets/ConnectionManager";

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

    if (responseNewRoom.complete && !responseNewRoom.error) {
      setNewRoom(responseNewRoom.data as IRoom);
    }
  };

  if (!!newRoom) {
    ConnectionManager.createInstance(newRoom.id.toString());
    return <Redirect to={`/waitingRoom?roomId=${newRoom.id}`} />;
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
