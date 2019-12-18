import React, { useState } from "react";
import dancers from "../../../utils/dancers";
import "./quizz.css";

interface IQuizz {
  track: string;
  choices: string[];
  incrementScore: () => void;
}

const Quizz: React.FC<IQuizz> = ({
  track,
  choices,
  incrementScore
}: IQuizz) => {
  const [dancer] = useState<string>(
    dancers[Math.floor(Math.random() * dancers.length)]
  );

  const handleAnswer = () => () => {
    // TODO : Faire requete au back
    const isAnswerTrue = true;

    if (isAnswerTrue) {
      incrementScore();
    }

    return;
  };

  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Which song is currently playing?</h2>
        <img height="180px" src={dancer} alt="dancer" />
      </div>
      <div className="grid-container">
        <div>
          <div className="grid">
            {choices.map((c, index) => (
              <button key={index} onClick={handleAnswer()}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {track && (
          <audio id="player" autoPlay={true} data-vscid="obacc5arn">
            <source src={track} type="audio/mpeg" />
          </audio>
        )}
      </div>
    </div>
  );
};

export default Quizz;
