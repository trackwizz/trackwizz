import React from "react";
import "./question.css";
import Dancers from "../../components/Dancers";
import { ReactComponent as Mute } from "../../../../images/mute.svg";
import { ReactComponent as Volume } from "../../../../images/volume.svg";
import { Answer } from "../../../../websockets/MessageType";

interface IQuestion {
  previewUrl: string;
  answers: Answer[];
  handleAnswer: (answer: Answer) => void;
  setIsMuted: (value: boolean) => void;
  isMuted: boolean;
}

const Question: React.FC<IQuestion> = ({
  answers,
  handleAnswer,
  isMuted,
  setIsMuted,
}: IQuestion) => {
  return (
    <div className="flex-container column" style={{ overflow: "auto" }}>
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
          style={{ height: "unset", marginBottom: "2rem" }}
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
  );
};

export default Question;
