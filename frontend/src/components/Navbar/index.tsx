import React, { useState, useEffect } from "react";
import "./navbar.css";
import { withRouter, RouteComponentProps, Redirect } from "react-router-dom";

const Navbar: React.FC<RouteComponentProps> = ({ location }) => {
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isHomeRedirection, setIsHomeRedirection] = useState<boolean>(false);
  const [isLeaderboard, setIsLeaderboard] = useState<boolean>(false);
  const [isLeaderboardRedirection, setIsLeaderboardRedirection] = useState<
    boolean
  >(false);

  useEffect(() => {
    let isHomeLocation = false;
    let isLeaderboardLocation = false;

    if (location.pathname === "/") {
      isHomeLocation = true;
    }

    if (location.pathname === "/leaderboard") {
      isLeaderboardLocation = true;
    }

    setIsHome(isHomeLocation);
    setIsLeaderboard(isLeaderboardLocation);
  }, [location]);

  const handleHomeRedirection = (): void => {
    setIsHomeRedirection(true);
  };

  const handleLeaderboardRedirection = (): void => {
    setIsLeaderboardRedirection(true);
  };

  if (isHomeRedirection) {
    return <Redirect to="/" />;
  }

  if (isLeaderboardRedirection) {
    return <Redirect to="/leaderboard" />;
  }

  if (!isHome && !isLeaderboard) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <React.Fragment>
      <div className="navbarContainer">
        <button
          className={isHome ? "navbarButton currentLocation" : "navbarButton"}
          onClick={handleHomeRedirection}
        >
          Home
        </button>
        <button
          className={
            isLeaderboard ? "navbarButton currentLocation" : "navbarButton"
          }
          onClick={handleLeaderboardRedirection}
        >
          Leaderboard
        </button>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Navbar);
