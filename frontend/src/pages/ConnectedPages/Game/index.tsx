import React, { useState, useEffect } from "react";
import Quizz from "./Quizz";
import "./game.css";
import Countdown from "./Countdown";
import { IGameEnum, ITrack, ITraksRequest } from "./types";
import Score from "./Score";
import { RouteComponentProps, Redirect } from "react-router-dom";

const Game: React.FC<RouteComponentProps> = ({ location }) => {
  const [step, setStep] = useState<IGameEnum>(IGameEnum.COUNTDOWN);
  const [tracks, setTracks] = useState<ITrack[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // TODO: Request to get tracks and choices
    if (location.search !== "") {
      const idGame = location.search
        .slice(1)
        .split("gameId=")
        .filter(el => el !== "")
        .shift();
      console.log(idGame);

      const request: ITraksRequest = {
        data: [
          {
            track: "Hello world !",
            choices: ["1", "2", "3", "4"]
          },
          {
            track: "Hello world ! v2",
            choices: ["1.2", "2.2", "3.2", "4.2"]
          }
        ],
        complete: true,
        error: false
      };

      if (request.complete === true && request.error === false) {
        setTracks(request.data);
      }

      if (request.complete === true && request.error === true) {
        setError(true);
      }
    }
  }, []);

  const incrementScore = (): void => {
    setScore(score + 1);
  };

  if (location.search === "" || error === true) {
    return <Redirect to="/" />;
  }

  return (
    <div className="height-100">
      {step === IGameEnum.COUNTDOWN && <Countdown setStep={setStep} />}
      {step === IGameEnum.QUIZZ && (
        <Quizz
          tracks={tracks || []}
          incrementScore={incrementScore}
          setStep={setStep}
        />
      )}
      {step === IGameEnum.SCORE && <Score score={score} />}
    </div>
  );
};

export default Game;
