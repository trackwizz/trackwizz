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

interface IPlayers {
  id: string;
  name: string;
}

const WaitingRoom: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayers[] | null>(null);
  const [nickName, setNickName] = useState<string>("Player");

  useEffect(() => {
    if (location.search !== "") {
      if (location.search.slice(1).includes("roomId=") !== undefined) {
        const roomId = location.search
          .slice(1)
          .split("roomId=")
          .filter(el => el !== "")
          .shift();

        requestRoomInfo(roomId || "");
      }
    }
  }, [location.search]);

  const onWaitingRoomUpdateReceived = ({
    players
  }: WaitingRoomUpdateMessage): void => {
    setPlayers(players.map((name, index) => ({ id: index.toString(), name })));
    setError(false);
  };

  ConnectionManager.getInstance().registerCallbackForMessage(
    MessageType.WAITING_ROOM_UPDATE,
    onWaitingRoomUpdateReceived
  );

  const requestRoomInfo = async (roomId: string) => {
    const requestRoom = {
      method: "GET" as Method,
      url: `/games/${roomId}`
    };
    const responseRoom = await axiosRequest(requestRoom);

    if (responseRoom.complete === true && responseRoom.error === false) {
      setRoomId((responseRoom.data as IRoom).id);
    }
  };

  const handleChangeNickName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNickName(event.target.value);
  };

  const handleStart = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
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
            <button className="play-button pulsate-fwd" onClick={handleStart}>
              &#9658;
            </button>
            <div>
              <label className="inputLabel">Username:</label>
              <input
                type="text"
                value={nickName}
                className="input"
                onChange={handleChangeNickName}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(WaitingRoom);
