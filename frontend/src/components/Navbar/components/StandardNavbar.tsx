import React from "react";
import { Link } from "react-router-dom";
import "../navbar.css";

interface IStandarNavbar {
  isHome: boolean;
  isLeaderboard: boolean;
}

const StandarNavbar: React.FC<IStandarNavbar> = ({
  isHome,
  isLeaderboard
}: IStandarNavbar): JSX.Element => {
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

export default StandarNavbar;
