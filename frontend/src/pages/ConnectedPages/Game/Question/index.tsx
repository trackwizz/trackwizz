import React from "react";
import "./question.css";
import Dancers from "../../components/Dancers";
import { ReactComponent as Mute } from "../../../../images/mute.svg";
import { ReactComponent as Volume } from "../../../../images/volume.svg";
import { Answer, PlayerInGame } from "../../../../websockets/MessageType";
import PlayersInGame from "../PlayersInGame";
import RemainingPlayTime from "../RemainingPlayTime";

interface IQuestion {
  previewUrl: string;
  answers: Answer[];
  handleAnswer: (answer: Answer) => void;
  setIsMuted: (value: boolean) => void;
  isMuted: boolean;
  remainingPlayTimeSeconds: number;
  remainingPlayers: number;
  playersInGame: PlayerInGame[];
}

const Question: React.FC<IQuestion> = ({
  answers,
  handleAnswer,
  isMuted,
  setIsMuted,
  remainingPlayTimeSeconds,
  remainingPlayers,
  playersInGame,
}: IQuestion): JSX.Element => {
  return (
    <div className="flex-container line" style={{ overflow: "auto" }}>
      <div className="flex-container column" style={
        {
          overflow: "auto",
          flexBasis: "40%",
        }
      }>
        <h2 className="fancy-text">Players in game</h2>
        <PlayersInGame players={playersInGame} />
      </div>
      <div className="flex-container column" style={
        {
          overflow: "auto",
          flexBasis: "60%",
        }
      }>
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
            <h2 className="fancy-text">Which song is currently playing?</h2>
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
                <button key={index} onClick={() => handleAnswer(answer)}>
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
