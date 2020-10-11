import React, { useState, useEffect } from "react";
import { Method } from "axios";
import { RouteComponentProps, withRouter } from "react-router";
import querystring from "query-string";

import "./leaderboard.css";
import { axiosRequest } from "../components/axiosRequest";

interface ILeaderboard {
  userId: string;
  userName: string;
  gamesNumber: number;
  answers: number;
  successes: number;
}

const Leaderboard: React.FC<RouteComponentProps> = ({
  location: { search }
}: RouteComponentProps): JSX.Element => {
  const [leaderboardTable, setLeaderboardTable] = useState<
    ILeaderboard[] | null
  >(null);

  const { gameId } = querystring.parse(search);
  const isForSpecificGame = !!gameId;

  useEffect(() => {
    const requestLeaderboard = async (): Promise<void> => {
      const request = {
        method: "get" as Method,
        url: `/scores/leaderboard${gameId ? `?gameId=${gameId}` : ""}`
      };

      const response = await axiosRequest(request);

      if (response.complete && !response.error) {
        setLeaderboardTable(response.data as ILeaderboard[]);
      }

      return;
    };

    requestLeaderboard();
  }, [gameId]);

  const setRowClassName = (index: number): string => {
    return (index + 1) % 2 ? "leaderboardEvenRowColor" : "leaderboardParRowColor";
  };

  const setColumnClassName = (index: number, column: number): string => {
    let className = "";

    if (column === 0) {
      className += "leaderboardFirstColumn";
    }

    if (column !== 0) {
      className += "leaderboardColumn";
    }

    if (leaderboardTable && index === leaderboardTable.length - 1) {
      if (column === 0) {
        className += " leaderboardLastRowFirstColumn";
      }

      if (column === 3) {
        className += " leaderboardLastRowLastColumn";
      }
    }

    return className;
  };

  if (leaderboardTable === null) {
    return <div />;
  }

  return (
    <div className="leaderboardContainer">
      <h1 className="leaderboardTitle">
        {isForSpecificGame ? "Game finished!" : "Leaderboard"}
      </h1>
      <table className="leaderboardTable">
        <thead className="leaderboardTitleRow">
          <tr>
            <td className="leaderboardTitleColumn firstTitleColumn">Name</td>
            {!isForSpecificGame && (
              <td className="leaderboardTitleColumn">Number Games</td>
            )}
            <td className="leaderboardTitleColumn">Total Score</td>
            <td className="leaderboardTitleColumn lastTitleColumn">
              Success Rate
            </td>
          </tr>
        </thead>
        <tbody>
          {leaderboardTable.map((p, index) => {
            return (
              <tr key={p.userId} className={setRowClassName(index)}>
                <td className={setColumnClassName(index, 0)}>{p.userName}</td>
                {!isForSpecificGame && (
                  <td className={setColumnClassName(index, 1)}>
                    {p.gamesNumber}
                  </td>
                )}
                <td className={setColumnClassName(index, 2)}>{p.successes}</td>
                <td className={setColumnClassName(index, 3)}>
                  {Math.round((p.successes / p.answers) * 100) / 100}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(Leaderboard);
