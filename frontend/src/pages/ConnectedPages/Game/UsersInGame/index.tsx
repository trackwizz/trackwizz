import React from "react";
import { UserInGame } from "../../../../websockets/MessageType";

import "./usersingame.css";

interface IUsersInGame {
  users: UserInGame[],
}

const maxUsersToDisplay = 14;
const maxCharactersPerName = 8;

const UsersInGame: React.FC<IUsersInGame> = ({ users: users }: IUsersInGame): JSX.Element => {
  const totalPlayers = users.length;
  const totalColumns = 3;

  const setRowClassName = (index: number): string => {
    return (index + 1) % 2 ? "usersInGameEvenRowColor" : "usersInGameParRowColor";
  }

  const setColumnClassName = (row: number, col: number): string => {
    let className = "usersInGameColumn";

    if (row == 0 && col == 0) {
      if (totalPlayers === 1) {
        return className += " usersInGameFullLeftCorner"
      }
      return className + " usersInGameTopLeftCorner"
    }
    if (row == totalPlayers - 1 && col == 0) {
      return className + " usersInGameBottomLeftCorner"
    }
    if (row == 0 && col == totalColumns - 1) {
      if (totalPlayers === 1) {
        return className += " usersInGameFullRightCorner"
      }
      return className + " usersInGameTopRightCorner"
    }
    if (row == totalPlayers - 1 && col == totalColumns - 1) {
      return className + " usersInGameBottomRightCorner"
    }

    return className;
  }

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

  users.sort((p1, p2) => p2.correctAnswers - p1.correctAnswers)

  return (
    <div className="usersInGameContainer">
      <table className="usersInGameTable">
        <tbody>
          {users.slice(0, maxUsersToDisplay).map((p, i) => {
            return (
              <tr className={setRowClassName(i)}>
                <td className={setColumnClassName(i, 0)}>{emojiPrefix(i)}</td>
                <td className={setColumnClassName(i, 1)}>
                  {p.user.name.slice(0, maxCharactersPerName)}
                </td>
                <td className={setColumnClassName(i, 2)}>{p.correctAnswers}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};

export default UsersInGame;
