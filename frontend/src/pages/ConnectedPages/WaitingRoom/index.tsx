import React, {useEffect, useState, useContext } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";

import "./waitingRoom.css";
import { IRoom } from "../components/types";
import { axiosRequest } from "../components/axiosRequest";
import { Method } from "axios";
import ConnectionManager from "../../../websockets/ConnectionManager";
import MessageType, {
  WaitingRoomUpdateMessage
} from "../../../websockets/MessageType";
import { UserContext } from "../components/UserContext";

interface IPlayers {
  id: string;
  name: string;
}

const WaitingRoom: React.FC<RouteComponentProps> = ({ history, location }) => {
  const userContext = useContext(UserContext);

  const [roomId, setRoomId] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayers[] | null>(null);
  /*
    0: normal,
    1: battle royal
  */
  const [gameMode, setGameMode] = useState<-1 | 0 | 1>(-1);

  useEffect(() => {
    if (userContext.user) {
      if (location.search !== "") {
        if (location.search.slice(1).includes("roomId=") !== undefined) {
          const roomId = location.search
            .slice(1)
            .split("roomId=")
            .filter(el => el !== "")
            .shift();

          if (roomId) {
            ConnectionManager.createInstance(roomId.toString(), {
              id: userContext.user.id,
              name: userContext.user.display_name
            });
            ConnectionManager.getInstance().registerCallbackForMessage(
              MessageType.WAITING_ROOM_UPDATE,
              onWaitingRoomUpdateReceived
            );
            ConnectionManager.getInstance().registerCallbackForMessage(
              MessageType.START_GAME,
              ({ countdownMs }) =>
                history.push(
                  `/game?gameId=${roomId}&countdownMs=${countdownMs}`
                )
            );
          }

          requestRoomInfo(roomId || "");
        }
      }
    }
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    // prevents unnecessary call of the effect on component initialisation.
    if (gameMode !== -1 && gameMode !== undefined) {
      const changeGameMode = {
        data: {
          mode: gameMode
        },
        method: "PUT" as Method,
        url: `/games/${roomId}`
      };
      axiosRequest(changeGameMode);
    }
    // eslint-disable-next-line
  }, [gameMode]);

  const onWaitingRoomUpdateReceived = ({
    players,
    gameMode
  }: WaitingRoomUpdateMessage): void => {
    setPlayers(players.map(player => ({ id: player.id, name: player.name })));
    setGameMode(gameMode);
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

  const onGameModeButtonPressed = (mode: 0 | 1): void => {
    setGameMode(mode);
  };

  return (
    <React.Fragment>
      <h2 className="waitingRoomTitle">Room Name : {roomId}</h2>
      <div className="waitingRoomContainer">
        <div className="waitingRoomSubContainer">
          <div className="playersContainer">
            <h1 className="playersTitle">Players</h1>
            <ul>
              {players &&
                players.map((p, index) => {
                  return (
                    <li key={index} className="player">
                      {p.name}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="startGameContainer">
            <div className="gameModeContainer">
              <p>Choose your game mode</p>
              <div className="gameModeButtonContainer">
                <button
                  className={`gameModeButton ${gameMode === 1 &&
                    "gameModeButtonToggled"}`}
                  onClick={(): void => onGameModeButtonPressed(1)}
                >
                  Battle Royale
                </button>
                <button
                  className={`gameModeButton ${gameMode === 0 &&
                    "gameModeButtonToggled"}`}
                  onClick={(): void => onGameModeButtonPressed(0)}
                >
                  Normal
                </button>
              </div>
            </div>
            <div className="startGameButtonContainer">
              <button className="play-button pulsate-fwd" onClick={handleStart}>
                &#9658;
              </button>
              <span className="instructions">Press play to start game</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(WaitingRoom);
