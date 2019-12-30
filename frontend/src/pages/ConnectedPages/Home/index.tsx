import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "./home.css";
import dancers from "../../../utils/dancers";

const Home: React.FC<RouteComponentProps> = () => {
  const [dancer] = useState<string>(
    dancers[Math.floor(Math.random() * dancers.length)]
  );

  return (
    <div className="flex-container column">
      <img height="180px" src={dancer} alt="dancer" />
      <div className="homeContainer">
        <button className="homeButton">Create new game</button>
        <button className="homeButton">Join current game</button>
      </div>
    </div>
  );
};

export default withRouter(Home);
