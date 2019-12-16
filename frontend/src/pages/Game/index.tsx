import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import Quizz from "./Quizz";
import "./game.css";
import { isTokenValid } from "../../utils/auth";

const Game: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
  }, [countdown]);

  if (!isTokenValid()) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="height-100">
      {countdown > 0 ? (
        <div className="flex-container">
          <div className="countdown scale-in-center">{countdown}</div>
        </div>
      ) : (
        <Quizz choices={["Highway to hell", "Supermassive Black Hole", "Dancing Queen", "The answer D"]} />
      )}
    </div>
  );
};

export default Game;
