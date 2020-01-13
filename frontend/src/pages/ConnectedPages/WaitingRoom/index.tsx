import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

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

const WaitingRoom: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayers[] | null>(null);
  const [nickName, setNickName] = useState<string>("Player");

  useEffect(() => {
    if (location.search !== "") {
      if (
        location.search
          .slice(1)
          .split("&")
          .find(el => el.includes("playlist")) !== undefined
      ) {
        const idPlaylist = (
          location.search
            .slice(1)
            .split("&")
            .find(el => el.includes("playlist")) || ""
        )
          .split("playlist=")
          .filter(el => el !== "")
          .shift();
        console.log(idPlaylist);

        // TODO: Add persons to game
        // POST "http://localhost:5000/game"
        // const requestRoom = axios({
        //   method: "POST",
        //   url: "http://localhost:5000/game"
        //   data: {
        //     playlistId: "idPlaylist"
        //   }
        // });
        // data: string;

        const requestRoom: IRequestRoom = {
          data: "roomId",
          complete: true,
          error: false
        };

        if (requestRoom.complete === true && requestRoom.error === false) {
          setRoomId(requestRoom.data);
        }

        if (requestRoom.complete === true && requestRoom.error === true) {
          setError(true);
        }
      }

      if (
        location.search
          .slice(1)
          .split("&")
          .find(el => el.includes("roomId")) !== undefined
      ) {
        // TODO: Request room id to add personne to room
        // POST "http://localhost:8888/game"
        // const requestRoom = axios({
        //   method: "PUT",
        //   url: "http://localhost:8888/game/:id/newPlayer"
        //   data: {
        //     player: "hello"
        //   }
        // })

        const requestRoom: IRequestRoom = {
          data: "roomId",
          complete: true,
          error: false
        };

        if (requestRoom.complete === true && requestRoom.error === false) {
          setRoomId(requestRoom.data);
        }
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

  const handleChangeNickName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNickName(event.target.value);
  };

  const handleStart = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    history.push("/game?gameId=sidfj");
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
