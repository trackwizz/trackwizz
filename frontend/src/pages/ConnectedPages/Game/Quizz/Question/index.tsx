import React, { useState, useEffect, useRef } from "react";
import dancers from "../../../../../utils/dancers";
import "./question.css";

interface IQuestion {
  track: string;
  choices: string[];
  incrementScore: () => void;
  incrementIndex: () => void;
}

const Question: React.FC<IQuestion> = ({
  track,
  choices,
  incrementScore,
  incrementIndex
}: IQuestion) => {
  const [dancer] = useState<string>(
    dancers[Math.floor(Math.random() * dancers.length)]
  );
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [isNextTrackAvailable, setIsNextTrackAvailable] = useState<boolean>(
    false
  );
  const player = useRef<null | HTMLAudioElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (remainingTime > 0 && isNextTrackAvailable === false) {
        setRemainingTime(remainingTime - 1);
      }

      if (remainingTime === 0) {
        handleTimeEnd();
      }
    }, 1000);
  }, [remainingTime]);

  const handleAnswer = () => () => {
    handleTimeEnd();
    // TODO : Request to have the rigth answer ?
    const isAnswerTrue = true;

    if (isAnswerTrue) {
      incrementScore();
    }
  };

  const handleTimeEnd = (): void => {
    if (player.current === null) {
      console.log(new Error("Player is not associated with anything"));
    }

    (player.current as HTMLAudioElement).pause();
    setIsNextTrackAvailable(true);
  };

  const handleNextQuestion = () => {
    setIsNextTrackAvailable(false);
    incrementIndex();
  };

  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Which song is currently playing?</h2>
        <img
          height="180px"
          src={dancer}
          alt="dancer"
          className={isNextTrackAvailable === false ? "" : "hidden"}
        />
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

      <div className="nextContainer">
        {isNextTrackAvailable && (
          <button onClick={handleNextQuestion}>Next</button>
        )}
      </div>

      <div>
        {track && (
          <audio ref={player} autoPlay={true} data-vscid="obacc5arn">
            <source src={track} type="audio/mpeg" />
          </audio>
        )}
      </div>
    </div>
  );
};

export default Question;
