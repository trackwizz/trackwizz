import React, { useState, useEffect } from "react";

import "./leaderboard.css";
import { axiosRequest } from "../components/axiosRequest";
import { Method } from "axios";

interface ILeaderboard {
  id: string;
  name: string;
  nbGames: number;
  score: number;
  successRate: number;
}

const requestLeaderboard = async() => {
  const request = {
    method : "get" as Method,
    url : "http://localhost:5000/scores",
    data : {}
  }

  const response = await axiosRequest(request);
  return response;
}

const Leaderboard: React.FC = () => {
  const [leaderboardTable, setLeaderboardTable] = useState<ILeaderboard[] | null>(null);

  useEffect(() => {
    // TODO: Request Leaderboard from database
    // GET "/leaderboard"
    // const requestLeaderboard: IRequestLeaderboard = await axios.get("http://localhost:8888/leaderboard")
    // data: ILeaderboard[];    

    requestLeaderboard()
      .then((response) => {
        if (response.complete && !response.error) {
          setLeaderboardTable(response.data as ILeaderboard[]);
        }
        else {
          setLeaderboardTable([
            {
              id: "difh",
              name: "isdhsij",
              nbGames: 27,
              score: 9584,
              successRate: 0.7
            },
            {
              id: "weovh",
              name: "xc ijsd",
              nbGames: 384,
              score: 38452,
              successRate: 0.3
            },
            {
              id: "csoj",
              name: "svsc oc",
              nbGames: 4975,
              score: 12938,
              successRate: 0.5
            }
          ])
        }
      })
  }, []);

  const setRowClassName = (index: number): string => {
    let className = "";
    className +=
      (index + 1) % 2 ? "leaderboardEvenRowColor" : "leaderboardParRowColor";

    return className;
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
    return <div></div>;
  }

  return (
    <div className="leaderboardContainer">
      <h1 className="leaderboardTitle">Leaderboard</h1>
      <table className="leaderboardTable">
        <thead className="leaderboardTitleRow">
          <tr>
            <td className="leaderboardTitleColumn firstTitleColumn">Name</td>
            <td className="leaderboardTitleColumn">Number Games</td>
            <td className="leaderboardTitleColumn">Total Score</td>
            <td className="leaderboardTitleColumn lastTitleColumn">
              Success Rate
            </td>
          </tr>
        </thead>
        <tbody>
          {leaderboardTable.map((p, index) => {
            return (
              <tr key={p.id} className={setRowClassName(index)}>
                <td className={setColumnClassName(index, 0)}>{p.name}</td>
                <td className={setColumnClassName(index, 1)}>{p.nbGames}</td>
                <td className={setColumnClassName(index, 2)}>{p.score}</td>
                <td className={setColumnClassName(index, 3)}>
                  {p.successRate}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
