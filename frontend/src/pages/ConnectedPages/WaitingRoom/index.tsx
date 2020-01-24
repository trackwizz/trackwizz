import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

import "./waitingRoom.css";
import { IRoom } from "../components/types";
import { axiosRequest } from "../components/axiosRequest";
import { Method } from "axios";

interface IPlayers {
  id: string;
  name: string;
}

interface IRequestPlayers {
  data: IPlayers[];
  complete: boolean;
  error: boolean;
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

      // TODO: Since the other players are going to come, this should be a web socket...
      const requestPlayers: IRequestPlayers = {
        data: [
          {
            id: "aojs",
            name: "Player 1"
          },
          {
            id: "dovjsoc",
            name: "Player 2"
          }
        ],
        complete: true,
        error: false
      };

      if (requestPlayers.complete === true && requestPlayers.error === false) {
        setPlayers(requestPlayers.data);
      }

      if (requestPlayers.complete === true && requestPlayers.error === true) {
        setError(true);
      }
    }
  }, []);

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
