import React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import { isTokenValid } from "../../utils/auth";

import "./home.css";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  if (!isTokenValid()) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex-container column">
      <button
        className="play-button pulsate-fwd"
        onClick={(event): void => {
          event.preventDefault();
          history.push("/game");
        }}
      >
        &#9658;
      </button>
    </div>
  );
};

export default withRouter(Home);
