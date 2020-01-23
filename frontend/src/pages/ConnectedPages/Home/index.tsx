import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "./home.css";
import dancers from "../../../utils/dancers";

// TODO remove once websocket connection after game creation is implemented.
const testWebsocket = (): void => {
  const ws = new WebSocket("ws://localhost:5000/");

  ws.onopen = (): void => {
    console.log("opened");
    ws.send(JSON.stringify({ type: "JOIN_GAME", gameId: "abcd" }));
  };

  ws.onmessage = ({ data }: MessageEvent): void => {
    console.log(data);
  };
};

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const [dancer] = useState<string>(
    dancers[Math.floor(Math.random() * dancers.length)]
  );

  const handleNewGame = (): void => {
    history.push("/playlists");
  };

  const handleJoinGame = (): void => {
    history.push("/joinRoom");
  };

  testWebsocket();

  return (
    <React.Fragment>
      <img height="180px" src={dancer} alt="dancer" />
      <div className="homeContainer">
        <button className="homeButton" onClick={handleNewGame}>
          Create new game
        </button>
        <button className="homeButton" onClick={handleJoinGame}>
          Join current game
        </button>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Home);
