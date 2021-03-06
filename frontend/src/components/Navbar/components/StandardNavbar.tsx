import React from "react";
import { Link } from "react-router-dom";
import "../navbar.css";

interface ILinkButton {
  isCurrentLink: boolean;
  linkPath: string;
  linkName: string;
}

const LinkButton: React.FC<ILinkButton> = ({
  isCurrentLink,
  linkPath,
  linkName
}: ILinkButton): JSX.Element => {
  return (
    <Link className="navbarLink" to={linkPath}>
      <button
        className={
          isCurrentLink ? "navbarButton currentLocation" : "navbarButton"
        }
      >
        {linkName}
      </button>
    </Link>
  );
};

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
        <LinkButton isCurrentLink={isHome} linkPath="/" linkName="Home" />
        <LinkButton
          isCurrentLink={isLeaderboard}
          linkPath="/leaderboard"
          linkName="Leaderboard"
        />
      </div>
    </div>
  );
};

export default StandarNavbar;
