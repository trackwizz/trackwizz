import React, { useEffect, useState } from "react";
import Quizz from "./Quizz";
import "./game.css";

const Game: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
  }, [countdown]);

  return (
    <div className="height-100">
      {countdown > 0 ? (
        <div className="flex-container">
          <div className="countdown scale-in-center">{countdown}</div>
        </div>
      ) : (
        <Quizz choices={["Choix 1", "Choix 2", "Choix 3", "Choix 4"]} />
      )}
    </div>
  );
};

export default Game;
