import React, { useRef } from "react";
import "./question.css";
import Dancers from "../../components/Dancers";
import { Answer } from "../../../../websockets/MessageType";

interface IQuestion {
  previewUrl: string;
  answers: Answer[];
  handleAnswer: (answer: Answer) => void;
}

const Question: React.FC<IQuestion> = ({
  previewUrl,
  answers,
  handleAnswer
}: IQuestion) => {
  const player = useRef<null | HTMLAudioElement>(null);

  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Which song is currently playing?</h2>
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

      <div>
        {previewUrl && (
          <audio ref={player} autoPlay={true} data-vscid="obacc5arn">
            <source src={previewUrl} type="audio/mpeg" />
          </audio>
        )}
      </div>
    </div>
  );
};

export default Question;
