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

<<<<<<< HEAD
  const handleJoinGame = (): void => {
    history.push("/joinRoom");
  };

=======
>>>>>>> Add selection playlist
  return (
    <React.Fragment>
      <img height="180px" src={dancer} alt="dancer" />
      <div className="homeContainer">
        <button className="homeButton" onClick={handleNewGame}>
          Create new game
        </button>
<<<<<<< HEAD
        <button className="homeButton" onClick={handleJoinGame}>
          Join current game
        </button>
=======
        <button className="homeButton">Join current game</button>
>>>>>>> Add selection playlist
      </div>
    </React.Fragment>
  );
};

export default withRouter(Home);
