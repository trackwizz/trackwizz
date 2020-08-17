import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import BackButton from "./components/BackButton";
import StandarNavbar from "./components/StandardNavbar";

import "./navbar.css";

interface ICurrentLocation {
  isHome: boolean;
  isLeaderboard: boolean;
  isLogin: boolean;
  isGame: boolean;
  isProfile: boolean;
}

const DEFAULT_CURRENT_LOCATION: ICurrentLocation = {
  isHome: false,
  isLeaderboard: false,
  isLogin: false,
  isGame: false,
  isProfile: false,
};

const Navbar: React.FC<RouteComponentProps> = ({ location }): JSX.Element => {
  const [currentLocation, setCurrentLocation] = useState<ICurrentLocation>(
    DEFAULT_CURRENT_LOCATION
  );

  useEffect(() => {
    setCurrentLocation({
      isHome: location.pathname === "/",
      isLeaderboard: location.pathname === "/leaderboard",
      isLogin: location.pathname === "/login",
      isGame: location.pathname === "/game",
      isProfile: location.pathname === "/profile",
    });
  }, [location]);

  if (currentLocation.isLogin) {
    return <div />;
  }

  if (
    !currentLocation.isHome &&
    !currentLocation.isLeaderboard &&
    !currentLocation.isProfile
  ) {
    return <BackButton isGame={currentLocation.isGame} />;
  }

  return (
    <StandarNavbar
      isHome={currentLocation.isHome}
      isLeaderboard={currentLocation.isLeaderboard}
      isProfile={currentLocation.isProfile}
    />
  );
};

export default withRouter(Navbar);
