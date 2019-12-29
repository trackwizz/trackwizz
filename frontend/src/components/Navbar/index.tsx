import React, { useState, useEffect } from "react";
import "./navbar.css";

const Navbar: React.FC = () => {
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isLeaderboard, setIsLeaderboard] = useState<boolean>(false);

  useEffect(() => {
    if (
      window.location.href
        .split("/")
        .slice(-1)
        .pop() === "home"
    ) {
      setIsHome(true);
    }

    if (
      window.location.href
        .split("/")
        .slice(-1)
        .pop() === "setIsLeaderboard"
    ) {
      setIsLeaderboard(true);
    }
  });

  const setHomeStyle = (): string => {
    return isHome ? "navbarButton currentLocation" : "navbarButton";
  };

  const setLeaderboardStyle = (): string => {
    return isLeaderboard ? "navbarButton currentLocation" : "navbarButton";
  };

  return (
    <React.Fragment>
      <div className="brand text-center">
        <h1 className="brand-name">Trackwizz</h1>
      </div>
      {(isHome || isLeaderboard) && (
        <div className="navbarContainer">
          <button className={setHomeStyle()}>Home</button>
          <button className={setLeaderboardStyle()}>Leaderboard</button>
        </div>
      )}
    </React.Fragment>
  );
};

export default Navbar;
