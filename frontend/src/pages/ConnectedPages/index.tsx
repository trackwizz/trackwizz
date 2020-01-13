import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { isTokenValid } from "../../utils/auth";

import "./connectedPages.css";

import Game from "./Game";
import Home from "./Home";
import Playlists from "./Playlists";
import WaitingRoom from "./WaitingRoom";
import JoinRoom from "./JoinRoom";
import Leaderboard from "./Leaderboard";

const ConnectedPages: React.FC = () => {
  if (isTokenValid()) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex-container column">
      <Switch>
        <Route path="/game" component={Game} />
        <Route path="/playlists" component={Playlists} />
        <Route path="/waitingRoom" component={WaitingRoom} />
        <Route path="/joinRoom" component={JoinRoom} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};

export default ConnectedPages;
