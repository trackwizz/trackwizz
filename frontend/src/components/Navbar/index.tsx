import React, { useState, useEffect } from "react";
import "./navbar.css";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";

const Navbar: React.FC<RouteComponentProps> = ({ location }) => {
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isLeaderboard, setIsLeaderboard] = useState<boolean>(false);

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

  if (!isHome && !isLeaderboard) {
    return <React.Fragment />;
  }

  return (
    <div className="mobileBottomMargin">
      <div className="navbarContainer">
        <Link className="navbarLink" to="/">
          <button
            className={isHome ? "navbarButton currentLocation" : "navbarButton"}
          >
            Home
          </button>
        </Link>

        <Link className="navbarLink" to="/leaderboard">
          <button
            className={
              isLeaderboard ? "navbarButton currentLocation" : "navbarButton"
            }
          >
            Leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
