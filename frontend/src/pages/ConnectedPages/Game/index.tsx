import React, { useState } from "react";
import "./game.css";
import Countdown from "./Countdown";
import { IGameEnum } from "./types";
import Score from "./Score";
import { RouteComponentProps } from "react-router-dom";
import MessageType, {
  QuestionUpdateMessage,
  Answer
} from "../../../websockets/MessageType";
import ConnectionManager from "../../../websockets/ConnectionManager";
import Question from "./Question";

const Game: React.FC<RouteComponentProps> = () => {
  const [step, setStep] = useState<IGameEnum>(IGameEnum.COUNTDOWN);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [score] = useState<number>(0);

  const onQuestionUpdateReceived = (question: QuestionUpdateMessage): void => {
    console.log(`Received question ${question}`);
    setPreviewUrl(question.previewUrl);
    setAnswers(question.answers);
  };

  ConnectionManager.getInstance().registerCallbackForMessage(
    MessageType.QUESTION_UPDATE,
    onQuestionUpdateReceived
  );

  const handleAnswer = () => (): void => {};

  return (
    <div className="height-100">
      {step === IGameEnum.COUNTDOWN && <Countdown setStep={setStep} />}
      {step === IGameEnum.QUIZZ && (
        <React.Fragment>
          <Question
            previewUrl={previewUrl!}
            answers={answers!}
            handleAnswer={handleAnswer}
          />
        </React.Fragment>
      )}
      {step === IGameEnum.SCORE && <Score score={score} />}
    </div>
  );
};

export default Game;
