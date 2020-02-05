import React, { useEffect, useContext } from "react";
import { Switch, Route, Redirect } from "react-router";
import { isTokenValid } from "../../utils/cookies";

import "./connectedPages.css";

import Game from "./Game";
import Home from "./Home";
import Playlists from "./Playlists";
import WaitingRoom from "./WaitingRoom";
import JoinRoom from "./JoinRoom";
import Leaderboard from "./Leaderboard";
import { UserContext } from "./components/UserContext";
import { setDefaultAuthorization } from "./components/axiosRequest";
import { IUser } from "./components/UserContext/types";
import { getUserInfoResponse } from "../../utils/getUserInfoResponse";

const ConnectedPages: React.FC = () => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    setDefaultAuthorization();
    updateUser();
  }, []);

  const updateUser = async () => {
    const responseUser = await getUserInfoResponse();

    if (responseUser.complete && !responseUser.error) {
      if (userContext.setUser) {
        userContext.setUser(responseUser.data as IUser);
      }
    }
  };

  if (!isTokenValid()) {
    return <Redirect to="/login" />;
  }

  if (!userContext.user) {
    return <div />;
  }

  return (
    <div className="flex-container column height-100">
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
