import React, { useEffect, useContext } from "react";
import { Switch, Route, Redirect } from "react-router";
import { isTokenValid } from "../../utils/cookies";

import "./connectedPages.css";

import Game from "./Game";
import Home from "./Home";
import CreateGame from "./CreateGame";
import WaitingRoom from "./WaitingRoom";
import JoinRoom from "./JoinRoom";
import Leaderboard from "./Leaderboard";
import { UserContext, ICreateContext } from "./components/UserContext";
import { setDefaultAuthorization } from "./components/axiosRequest";
import { IUser } from "./components/UserContext/types";
import { getUserInfoResponse } from "../../utils/getUserInfoResponse";
import Profile from "./Profile";

const ConnectedPages: React.FC = () => {
  const userContext: ICreateContext = useContext(UserContext);
  const setUserContext: React.Dispatch<IUser | undefined> | undefined =
    userContext.setUser;

  useEffect(() => {
    const updateUser = async (): Promise<void> => {
      const responseUser = await getUserInfoResponse();

      if (responseUser.complete && !responseUser.error) {
        if (setUserContext) {
          setUserContext(responseUser.data as IUser);
        }
      }

      return;
    };

    setDefaultAuthorization();
    updateUser();
  }, [setUserContext]);

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
        <Route path="/playlists" component={CreateGame} />
        <Route path="/waitingRoom" component={WaitingRoom} />
        <Route path="/joinRoom" component={JoinRoom} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/profile/" component={Profile} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};

export default ConnectedPages;
