import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "./home.css";
import dancers from "../../../utils/dancers";

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