import React, { useState } from "react";
import Question from "./Question";
import { IGameEnum, ITrack } from "../types";

interface IQuizz {
  tracks: ITrack[];
  incrementScore: () => void;
  setStep: React.Dispatch<React.SetStateAction<IGameEnum>>;
}

const Quizz: React.FC<IQuizz> = ({
  tracks,
  incrementScore,
  setStep
}: IQuizz) => {
  const [indexTrack, setIndexTrack] = useState<number>(0);

  const incrementIndex = () => {
    if (tracks) {
      if (indexTrack < tracks.length - 1) {
        setIndexTrack(indexTrack + 1);
      } else {
        setStep(IGameEnum.SCORE);
      }
    }
  };

  if (tracks === null) {
    console.log(new Error("No tracks have been found"));
    return <div />;
  }

  return (
    <React.Fragment>
      <Question
        track={tracks[indexTrack].track}
        choices={tracks[indexTrack].choices}
        incrementScore={incrementScore}
        incrementIndex={incrementIndex}
      />
    </React.Fragment>
  );
};

export default Quizz;
