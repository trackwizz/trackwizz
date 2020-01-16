import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "./home.css";
import Dancers from "../components/Dancers";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const handleNewGame = (): void => {
    history.push("/playlists");
  };

  const handleJoinGame = (): void => {
    history.push("/joinRoom");
  };

  return (
    <React.Fragment>
      <Dancers />
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
