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
  location: { search },
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
        url: `/scores/leaderboard${gameId ? `?gameId=${gameId}` : ""}`,
      };

      const response = await axiosRequest(request);

      if (response.complete && !response.error) {
        setLeaderboardTable(response.data as ILeaderboard[]);
      }

      return;
    };

    requestLeaderboard();
  }, [gameId]);

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
          {leaderboardTable.map((p) => {
            return (
              <tr key={p.userId} className="leaderboardRow">
                <td className="leaderboardBodyColumn">{p.userName}</td>
                {!isForSpecificGame && (
                  <td className="leaderboardBodyColumn">{p.gamesNumber}</td>
                )}
                <td className="leaderboardBodyColumn">{p.successes}</td>
                <td className="leaderboardBodyColumn">
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
