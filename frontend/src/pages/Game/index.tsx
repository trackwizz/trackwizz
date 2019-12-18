import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import Quizz from "./Quizz";
import "./game.css";
import { isTokenValid } from "../../utils/auth";
import Score from "./Score";

const Game: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
  }, [countdown]);

  const incrementScore = () => {
    setScore(score + 1);
  };

  if (!isTokenValid()) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="height-100">
      {countdown > 0 && (
        <div className="flex-container">
          <div className="countdown scale-in-center">{countdown}</div>
        </div>
      )}
      {countdown === 0 && hasEnded === false && (
        <Quizz
          choices={[
            "Highway to hell",
            "Supermassive Black Hole",
            "Dancing Queen",
            "The answer D"
          ]}
          setHasEnded={setHasEnded}
          incrementScore={incrementScore}
        />
      )}
      {countdown === 0 && hasEnded === true && <Score score={score} />}
    </div>
  );
};

export default Game;
