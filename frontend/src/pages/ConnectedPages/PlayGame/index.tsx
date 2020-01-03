import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "./home.css";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <button
      className="play-button pulsate-fwd"
      onClick={(event): void => {
        event.preventDefault();
        history.push("/game");
      }}
    >
      &#9658;
    </button>
  );
};

export default withRouter(Home);
