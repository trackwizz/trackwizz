import React, { useEffect, useState } from "react";
import { IGameEnum } from "../types";

interface ICountdown {
  setStep: React.Dispatch<React.SetStateAction<IGameEnum>>;
}

const Countdown: React.FC<ICountdown> = ({ setStep }: ICountdown) => {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }

      if (countdown === 0) {
        setStep(IGameEnum.QUIZZ);
      }
    }, 1000);
  }, [countdown]);

  return (
    <div className="flex-container">
      <div className="countdown scale-in-center">{countdown}</div>
    </div>
  );
};

export default Countdown;
