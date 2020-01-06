import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import "./waitingRoom.css";

interface IPlayers {
  id: string;
  name: string;
}

interface IRequestRoom {
  data: string;
  complete: boolean;
  error: boolean;
}

interface IRequestPlayers {
  data: IPlayers[];
  complete: boolean;
  error: boolean;
}

const WaitingRoom: React.FC<RouteComponentProps> = ({ history }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<IPlayers[] | null>(null);
  const [nickName, setNickName] = useState<string>("Player");

  useEffect(() => {
    // TODO: Request room id so others can join
    const requestRoom: IRequestRoom = {
      data: "idRoom",
      complete: true,
      error: false
    };

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

    if (requestRoom.complete === true && requestRoom.error === false) {
      setRoomId(requestRoom.data);
    }

    if (requestPlayers.complete === true && requestPlayers.error === false) {
      setPlayers(requestPlayers.data);
    }
  }, []);

  const handleChangeNickName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNickName(event.target.value);
  };

  const handleStart = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    history.push("/game");
  };

  return (
    <React.Fragment>
      <h2 className="waitingRoomTitle">Room : {roomId}</h2>
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
              <label className="usernameTitle">Username:</label>
              <input
                type="text"
                value={nickName}
                className="usernameInput"
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
