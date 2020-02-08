import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import BackButton from "./components/BackButton";
import StandarNavbar from "./components/StandardNavbar";
import "./navbar.css";

const Navbar: React.FC<RouteComponentProps> = ({ location }): JSX.Element => {
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isLeaderboard, setIsLeaderboard] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    setIsHome(location.pathname === "/");
    setIsLeaderboard(location.pathname === "/leaderboard");
    setIsLogin(location.pathname === "/login");
  }, [location]);

  if (isLogin) {
    return <div />;
  }

  if (!isHome && !isLeaderboard) {
    return <BackButton />;
  }

  return <StandarNavbar isHome={isHome} isLeaderboard={isLeaderboard} />;
};

export default withRouter(Navbar);
