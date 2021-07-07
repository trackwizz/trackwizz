import React, { useContext, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import "../Leaderboard/leaderboard.css";
import "./profile.css";
import { UserContext, ICreateContext } from "../components/UserContext";
import { ReactComponent as DefaultProfile } from "../../../images/default-profile.svg";

const Profile: React.FC<RouteComponentProps> = (): JSX.Element => {
  const userContext: ICreateContext = useContext(UserContext);
  const user = userContext.user;
  const [isToggleActive, setIsToggleActive] = useState(false);

  const handleToggleClick = () => {
    setIsToggleActive(!isToggleActive);
  };

  const countryToFlag = (isoCode: string) => {
    return typeof String.fromCodePoint !== "undefined"
      ? isoCode
          .toUpperCase()
          .replace(/./g, (char) =>
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          )
      : isoCode;
  };

  if (!user) {
    return <div />;
  }

  return (
    <div className="leaderboardContainer">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "1em 0",
        }}
      >
        {user.images.length === 0 ? (
          <DefaultProfile />
        ) : (
          <img src={`${user.images.reverse()[0]}`} alt="Profile" />
        )}
      </div>
      <h1 style={{ margin: "2rem 2rem 0rem 2rem" }}>Profile</h1>
      <table
        className="leaderboardTable"
        style={{
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <tr style={{ borderBottom: "1px solid rgb(238 238 238 / 30%)" }}>
            <td
              style={{
                whiteSpace: "nowrap",
                padding: "1em 1em 1em 0px",
              }}
            >
              Country
            </td>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
              }}
            >
              {countryToFlag(user.country)}
            </td>
            <td>
              <span
                style={{
                  display: "none",
                }}
              >
                Edit
              </span>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid rgb(238 238 238 / 30%)" }}>
            <td
              style={{
                whiteSpace: "nowrap",
                padding: "1em 1em 1em 0px",
              }}
            >
              Username
            </td>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
              }}
            >
              {user.display_name}
            </td>
            <td style={{ textAlign: "right" }}>
              {" "}
              <span style={{ marginRight: "4px" }}>Edit</span>
            </td>
          </tr>
        </tbody>
      </table>
      <h1 style={{ margin: "2rem 2rem 0rem 2rem" }}>Statistics</h1>
      <table
        className="leaderboardTable"
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid rgb(238 238 238 / 30%)" }}>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Games
            </td>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Total Score
            </td>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Win Rate
            </td>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid rgb(238 238 238 / 30%)" }}>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              59
            </td>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              38
            </td>
            <td
              style={{
                wordBreak: "break-all",
                padding: "1em 0px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              0.6
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          margin: "2rem 0",
        }}
      >
        <h4 style={{ margin: "0 8px 0 0px" }}>Advance Information</h4>
        <div
          className={`toggle ${
            isToggleActive ? "toggleActive" : "toggleInactive"
          }`}
          onClick={handleToggleClick}
        />
      </div>
    </div>
  );
};

export default withRouter(Profile);
