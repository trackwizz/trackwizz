import React from "react";
import "./question.css";
import Dancers from "../../components/Dancers";
import { ReactComponent as Mute } from "../../../../images/mute.svg";
import { ReactComponent as Volume } from "../../../../images/volume.svg";
import { Answer, UserInGame } from "../../../../websockets/MessageType";
import UsersInGame from "../UsersInGame";
import RemainingPlayTime from "../RemainingPlayTime";

interface IQuestion {
  previewUrl: string;
  answers: Answer[];
  handleAnswer: (answer: Answer) => void;
  setIsMuted: (value: boolean) => void;
  isMuted: boolean;
  remainingPlayTimeSeconds: number;
  remainingPlayers: number;
  usersInGame: UserInGame[];
}

const Question: React.FC<IQuestion> = ({
  answers,
  handleAnswer,
  isMuted,
  setIsMuted,
  remainingPlayTimeSeconds,
  remainingPlayers,
  usersInGame: usersInGame,
}: IQuestion): JSX.Element => {
  return (
    <div className="question-container">
      <div className="playersInGame">
        <h2 className="fancy-text">Players in game</h2>
        <UsersInGame users={usersInGame} />
      </div>
      <div className="questionAndAnswers">
        <button
          className="play-button muted-button mobile-only fixedTop"
          onClick={(): void => {
            setIsMuted(!isMuted);
          }}
        >
          {isMuted ? <Mute /> : <Volume />}
        </button>
        <div className="text-center">
          <div
            className="flex-container"
            style={{ height: "unset", marginBottom: "1rem" }}
          >
            <h2 className="fancy-text questionTextFull">Which song is currently playing?</h2>
            <h2 className="fancy-text questionTextSmall">Current song?</h2>
            <button
              className="play-button muted-button mobile-hidden"
              onClick={(): void => {
                setIsMuted(!isMuted);
              }}
            >
              {isMuted ? <Mute /> : <Volume />}
            </button>
          </div>
          <RemainingPlayTime
            remainingPlayTimeSeconds={remainingPlayTimeSeconds}
            remainingPlayers={remainingPlayers}
          />
          <Dancers />
        </div>
        <div className="grid-container">
          <div>
            <div className="grid">
              {answers.map((answer, index) => (
                <button
                  className="answerButton"
                  key={index} onClick={() => handleAnswer(answer)}>
                  <div>{`${answer.name}`}</div>
                  <div>{`by ${answer.artist}`}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
