import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "./home.css";
import Dancers from "../components/Dancers";
import { UserContext } from "../components/UserContext";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const userContext = useContext(UserContext);

  const handleNewGame = (): void => {
    history.push("/playlists");
  };

  const handleJoinGame = (): void => {
    history.push("/joinRoom");
  };

  return (
    <React.Fragment>
      <h1>{`Bonjour ${
        userContext.user ? userContext.user.display_name : ""
      }`}</h1>
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
