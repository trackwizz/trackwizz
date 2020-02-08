import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { ReactComponent as Back } from "../../../images/back.svg";
import "../navbar.css";
import ConnectionManager from "../../../websockets/ConnectionManager";

const BackButton: React.FC<RouteComponentProps> = ({
  location,
  history
}): JSX.Element => {
  const [isGame, setIsGame] = useState<boolean>(false);

  useEffect(() => {
    setIsGame(location.pathname === "/game");
  }, [location]);

  const lastLocation = useLastLocation();

  const handleClickBackButton = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void => {
    event.preventDefault();
    if (isGame) {
      ConnectionManager.clearConnection();
      history.push("/");
    } else {
      history.goBack();
    }
  };

  return (
    <div className="back-button-container">
      <a
        onClick={handleClickBackButton}
        href={isGame ? "/" : (lastLocation || { pathname: "/" }).pathname}
      >
        <Back />
        {isGame ? "Home" : "Back"}
      </a>
    </div>
  );
};

export default withRouter(BackButton);
