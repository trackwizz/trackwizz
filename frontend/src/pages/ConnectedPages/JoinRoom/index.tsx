import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import "./joinRoom.css";
import ConnectionManager from "../../../websockets/ConnectionManager";
import { Method } from "axios";
import { axiosRequest } from "../components/axiosRequest";
import { UserContext } from "../components/UserContext";

const JoinRoom: React.FC = () => {
  const userContext = useContext(UserContext);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRedirected, setIsRedirected] = useState<boolean>(false);
  const [gameNotFound, setGameNotFound] = useState<boolean>(false);

  const handleRoomIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRoomId(event.target.value);
  };

  const handleJoinGame = async (): Promise<void> => {
    if (roomId === null) {
      return;
    }

    const checkGameExists = {
      method: "GET" as Method,
      url: `/games/${roomId}`
    };
    const error = (await axiosRequest(checkGameExists)).error;

    if (error) {
      setGameNotFound(true);
      return;
    }

    setGameNotFound(false);

    const findRoomRequest = true;

    if (findRoomRequest) {
      setIsRedirected(true);
    }
  };

  if (isRedirected && userContext.user) {
    ConnectionManager.createInstance(roomId!, {
      id: userContext.user.id,
      name: userContext.user.display_name
    });
    return <Redirect to={`/waitingRoom?roomId=${roomId}`} />;
  }

  return (
    <React.Fragment>
      <div className="inputContainer">
        <label className="inputLabel">Room Name:</label>
        <input
          type="text"
          value={roomId || ""}
          className="input"
          onChange={handleRoomIdChange}
        />
      </div>
      {gameNotFound && (
        <div className="errorContainer">
          Game not found, please check you entered the correct value :)
        </div>
      )}
      <button className="fullWidthButton" onClick={handleJoinGame}>
        Join game
      </button>
    </React.Fragment>
  );
};

export default JoinRoom;
