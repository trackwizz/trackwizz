import React, { useEffect, useState } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";

import "./waitingRoom.css";
import { IRoom } from "../components/types";
import { axiosRequest } from "../components/axiosRequest";
import { Method } from "axios";
import ConnectionManager from "../../../websockets/ConnectionManager";
import MessageType, {
  WaitingRoomUpdateMessage
} from "../../../websockets/MessageType";
import Dancers from "../components/Dancers";

interface IPlayers {
  id: string;
  name: string;
}

const WaitingRoom: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayers[] | null>(null);

  useEffect(() => {
    if (location.search !== "") {
      if (location.search.slice(1).includes("roomId=") !== undefined) {
        const roomId = location.search
          .slice(1)
          .split("roomId=")
          .filter(el => el !== "")
          .shift();

        if (roomId) {
          ConnectionManager.createInstance(roomId.toString());
          ConnectionManager.getInstance().registerCallbackForMessage(
            MessageType.WAITING_ROOM_UPDATE,
            onWaitingRoomUpdateReceived
          );
          ConnectionManager.getInstance().registerCallbackForMessage(
            MessageType.START_GAME,
            ({ countdownMs }) =>
              history.push(`/game?gameId=${roomId}&countdownMs=${countdownMs}`)
          );
        }

        requestRoomInfo(roomId || "");
      }
    }
  }, [location.search]);

  const onWaitingRoomUpdateReceived = ({
    players
  }: WaitingRoomUpdateMessage): void => {
    setPlayers(players.map((name, index) => ({ id: index.toString(), name })));
  };

  const requestRoomInfo = async (roomId: string) => {
    const requestRoom = {
      method: "GET" as Method,
      url: `/games/${roomId}`
    };
    const responseRoom = await axiosRequest(requestRoom);

    if (responseRoom.complete === true && responseRoom.error === false) {
      setRoomId((responseRoom.data as IRoom).id);
    }

    if (responseRoom.complete === true && responseRoom.error === true) {
      setError(true);
    }
  };

  const handleStart = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    ConnectionManager.getInstance().sendMessage({
      gameId: roomId,
      type: MessageType.REQUEST_START_GAME
    });
    history.push(`/game?gameId=${roomId}`);
  };

  if (location.search === "" || error === true) {
    return <Redirect to={"/"} />;
  }

  return (
    <React.Fragment>
      <h2 className="waitingRoomTitle">Room Name : {roomId}</h2>
      <div className="waitingRoomContainer">
        <div className="waitingRoomSubContainer">
          <div className="playersContainer">
            <h1 className="playersTitle">Players</h1>
            <ul>
              {players &&
                players.map(p => {
                  return (
                    <li key={p.id} className="player">
                      {p.name}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="startGameContainer">
            <Dancers />
            <button className="play-button pulsate-fwd" onClick={handleStart}>
              &#9658;
            </button>
            <span className="instructions">Press play to start game</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(WaitingRoom);
