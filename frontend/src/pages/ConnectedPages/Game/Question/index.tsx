import React from "react";
import "./question.css";
import Dancers from "../../components/Dancers";
import { Answer } from "../../../../websockets/MessageType";

interface IQuestion {
  previewUrl: string;
  answers: Answer[];
  handleAnswer: (test: any) => void;
}

const Question: React.FC<IQuestion> = ({
  answers,
  handleAnswer
}: IQuestion) => {
  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Which song is currently playing?</h2>
        <Dancers />
      </div>
      <div className="grid-container">
        <div>
          <div className="grid">
            {answers.map((c, index) => (
              <button key={index} onClick={() => handleAnswer(c.id)}>
                <div>{`${c.name}`}</div>
                <div>{`by ${c.artist}`}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
