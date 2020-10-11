import React from "react";
import { PlayerInGame } from "../../../../websockets/MessageType";

import "./playersingame.css";

interface IPlayersInGame {
  players: PlayerInGame[],
}

const maxPlayersToDisplay = 14;
const maxCharactersPerName = 8;

const PlayersInGame: React.FC<IPlayersInGame> = ({ players }: IPlayersInGame): JSX.Element => {
  players.sort((p1, p2) => p2.correctAnswers - p1.correctAnswers)

  const totalPlayers = players.length

  const setRowClassName = (index: number): string => {
    let className = "";
    className +=
      (index + 1) % 2 ? "playersInGameEvenRowColor" : "playersInGameParRowColor";

    return className;
  };

  const emojiPrefix = (index: number): string => {
    const ranking = index + 1;
    if (ranking === 1) {
      return "🥇"
    }
    if (ranking === totalPlayers) {
      return "😴"
    }
    if (ranking === 2) {
      return "🥈"
    }
    if (ranking === 3) {
      return "🥉"
    }
    return ""
  }

  return (
    <div className="playersInGameContainer">
      <table className="playersInGameTable">
        <tbody>
          {players.slice(0, maxPlayersToDisplay).map((p, i) => {
            return (
              <tr className={setRowClassName(i)}>
                <td className="playersInGameColumn">{emojiPrefix(i)}</td>
                <td className="playersInGameColumn">
                  {p.userName.slice(0, maxCharactersPerName)}
                </td>
                <td className="playersInGameColumn">{p.correctAnswers}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};

export default PlayersInGame;
