import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { ReactComponent as Back } from "../../../images/back.svg";
import "../navbar.css";
import ConnectionManager from "../../../websockets/ConnectionManager";

type IBackButton = { isGame: boolean } & RouteComponentProps;

const BackButton: React.FC<IBackButton> = ({
  history,
  isGame
}: IBackButton): JSX.Element => {
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
