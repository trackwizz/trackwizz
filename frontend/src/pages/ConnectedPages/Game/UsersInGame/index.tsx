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
  var columnClassName = "usersInGameColumn";
  if (totalPlayers === 1) {
    columnClassName += " oneUser";
  } else {
    columnClassName += " multipleUsers";
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
              <tr className="usersInGameRow">
                <td className={columnClassName}>{emojiPrefix(i)}</td>
                <td className={columnClassName}>
                  {p.user.name.slice(0, maxCharactersPerName)}
                </td>
                <td className={columnClassName}>{p.correctAnswers}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};

export default UsersInGame;
