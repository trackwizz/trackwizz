import React, { useState } from "react";
import Quizz from "./Quizz";
import "./game.css";
import Countdown from "./Countdown";
import { IGameEnum } from "./types";
import Score from "./Score";

const Game: React.FC = () => {
  const [step, setStep] = useState<IGameEnum>(IGameEnum.COUNTDOWN);
  const [score, setScore] = useState<number>(0);

  const incrementScore = (): void => {
    setScore(score + 1);
  };

  return (
    <div className="height-100">
      {step === IGameEnum.COUNTDOWN && <Countdown setStep={setStep} />}
      {step === IGameEnum.QUIZZ && (
        <Quizz incrementScore={incrementScore} setStep={setStep} />
      )}
      {step === IGameEnum.SCORE && <Score score={score} />}
    </div>
  );
};

export default Game;
