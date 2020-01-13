import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import "./joinRoom.css";

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRedirected, setIsRedirected] = useState<boolean>(false);

  const handleRoomIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRoomId(event.target.value);
  };

  const handleJoinGame = (): void => {
    if (roomId === null) {
      return;
    }

    const findRoomRequest = true;

    if (findRoomRequest) {
      setIsRedirected(true);
    }
  };

  if (isRedirected) {
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
      <button className="fullWidthButton" onClick={handleJoinGame}>
        Join game
      </button>
    </React.Fragment>
  );
};

export default JoinRoom;
