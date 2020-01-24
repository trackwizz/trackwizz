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

// BEGIN TODO place that in a wrapper for components to easily access
const ping = (ws: WebSocket, gameId: number): void => {
  console.log("ping");
  ws.send(JSON.stringify({ type: "PING", gameId }));
  setTimeout(() => ping(ws, gameId), 1000);
};

const testWebsocket = (gameId: number): void => {
  const ws = new WebSocket("ws://localhost:5000/");

  ws.onopen = (): void => {
    console.log("opened");
    ws.send(JSON.stringify({ type: "JOIN_GAME", gameId }));
    ping(ws, gameId);
  };

  ws.onmessage = ({ data }: MessageEvent): void => {
    console.log(data);
  };
};
// END TODO

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
    testWebsocket(newRoom.id);
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
