import React, { useEffect, useState } from "react";
import { IGameEnum } from "../types";

interface ICountdown {
  setStep: React.Dispatch<React.SetStateAction<IGameEnum>>;
  countdownMs: number;
}

const Countdown: React.FC<ICountdown> = ({
  setStep,
  countdownMs
}: ICountdown): JSX.Element => {
  const [countdown, setCountdown] = useState<number>(
    Math.round(countdownMs / 1000)
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }

      if (countdown === 0) {
        setStep(IGameEnum.QUIZZ);
      }
    }, 1000);
    return (): void => {
      clearTimeout(timeout);
    };
  }, [countdown, setStep]);

  return (
    <div className="flex-container">
      <div className="countdown scale-in-center">{countdown}</div>
    </div>
  );
};

export default Countdown;
