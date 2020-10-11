import React from "react";
import { UserInGame } from "../../../../websockets/MessageType";

import "./usersingame.css";

interface IUsersInGame {
  users: UserInGame[],
}

const maxUsersToDisplay = 14;
const maxCharactersPerName = 8;

const UsersInGame: React.FC<IUsersInGame> = ({ users: users }: IUsersInGame): JSX.Element => {
  const setRowClassName = (index: number): string => {
    return (index + 1) % 2 ? "usersInGameEvenRowColor" : "usersInGameParRowColor";
  };

  const emojiPrefix = (index: number): string => {
    const ranking = index + 1;
    if (ranking === 1) {
      return "🥇"
    }
    if (ranking === users.length) {
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
                <td className="usersInGameColumn">{emojiPrefix(i)}</td>
                <td className="usersInGameColumn">
                  {p.user.name.slice(0, maxCharactersPerName)}
                </td>
                <td className="usersInGameColumn">{p.correctAnswers}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};

export default UsersInGame;
