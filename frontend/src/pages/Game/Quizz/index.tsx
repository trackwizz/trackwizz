import React, { useState, useEffect } from "react";
import Question from "./Question";
import { IGameEnum } from "../types";

interface IQuizz {
  incrementScore: () => void;
  setStep: React.Dispatch<React.SetStateAction<IGameEnum>>;
}

interface ITracks {
  track: string;
  choices: string[];
}

interface IRequest {
  data: ITracks[];
  complete: boolean;
  error: boolean;
}

const Quizz: React.FC<IQuizz> = ({ incrementScore, setStep }: IQuizz) => {
  const [tracks, setTracks] = useState<ITracks[] | null>(null);
  const [indexTrack, setIndexTrack] = useState<number>(0);

  useEffect(() => {
    // TODO: Request to get tracks and choices
    const request: IRequest = {
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

    if (request.error === false && request.complete === true) {
      setTracks(request.data);
    }
  }, []);

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
