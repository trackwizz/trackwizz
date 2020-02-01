import React, { useState, useRef, useEffect } from "react";
import querystring from "query-string";
import "./game.css";
import Countdown from "./Countdown";
import { IGameEnum } from "./types";
import Score from "./Score";
import { RouteComponentProps, withRouter } from "react-router-dom";
import MessageType, {
  QuestionUpdateMessage,
  Answer
} from "../../../websockets/MessageType";
import ConnectionManager from "../../../websockets/ConnectionManager";
import Question from "./Question";

const Game: React.FC<RouteComponentProps> = ({ location }) => {
  const [step, setStep] = useState<IGameEnum>(IGameEnum.COUNTDOWN);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score] = useState<number>(0);
  const player = useRef<null | HTMLAudioElement>(null);

  useEffect(() => {
    (async function reloadPlayer() {
      if (player && player.current) {
        player.current.pause();
        player.current.src = previewUrl;
        await player.current.play();
      }
    })();
  }, [previewUrl]);

  const onQuestionUpdateReceived = async (
    question: QuestionUpdateMessage
  ): Promise<void> => {
    setStep(IGameEnum.QUIZZ);
    setAnswers(question.answers);
    setPreviewUrl(question.previewUrl);
  };

  const countdownMs = querystring.parse(location.search).countdownMs as string;

  ConnectionManager.getInstance().registerCallbackForMessage(
    MessageType.QUESTION_UPDATE,
    onQuestionUpdateReceived
  );

  const handleAnswer = (idTrack: string): void => {
    console.log(idTrack);
  };

  return (
    <div className="height-100">
      {step === IGameEnum.COUNTDOWN && (
        <Countdown
          setStep={setStep}
          countdownMs={parseInt(countdownMs) || 3000}
        />
      )}
      {step === IGameEnum.QUIZZ && (
        <React.Fragment>
          <Question
            previewUrl={previewUrl!}
            answers={answers!}
            handleAnswer={handleAnswer}
          />
          <audio ref={player} data-vscid="obacc5arn" />
        </React.Fragment>
      )}
      {step === IGameEnum.SCORE && <Score score={score} />}
    </div>
  );
};

export default withRouter(Game);
