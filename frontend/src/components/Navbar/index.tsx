import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { ReactComponent as Back } from "../../images/back.svg";
import "./navbar.css";

const Navbar: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isLeaderboard, setIsLeaderboard] = useState<boolean>(false);
  const [isGame, setIsGame] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    setIsHome(location.pathname === "/");
    setIsLeaderboard(location.pathname === "/leaderboard");
    setIsGame(location.pathname === "/game");
    setIsLogin(location.pathname === "/login");
  }, [location]);

  const lastLocation = useLastLocation();

  if (isLogin) {
    return <div></div>;
  }

  if (!isHome && !isLeaderboard) {
    return (
      <div className="back-button-container">
        <a
          onClick={(event): void => {
            event.preventDefault();
            if (isGame) {
              history.push("/");
            } else {
              history.goBack();
            }
          }}
          href={isGame ? "/" : (lastLocation || { pathname: "/" }).pathname}
        >
          <Back />
          {isGame ? "Home" : "Back"}
        </a>
      </div>
    );
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
