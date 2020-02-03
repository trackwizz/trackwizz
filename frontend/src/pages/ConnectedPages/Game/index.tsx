import React, { useState, useRef, useEffect } from "react";
import querystring from "query-string";
import "./game.css";
import Countdown from "./Countdown";
import { IGameEnum } from "./types";
import Score from "./Score";
import { RouteComponentProps, withRouter } from "react-router-dom";
import MessageType, {
  QuestionUpdateMessage,
  Answer,
  AnswerResultMessage,
  GameEndMessage
} from "../../../websockets/MessageType";
import ConnectionManager from "../../../websockets/ConnectionManager";
import Question from "./Question";
import { getToken } from "../../../utils/cookies";
import AnswerResult from "./AnswerResult";

const Game: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [step, setStep] = useState<IGameEnum>(IGameEnum.COUNTDOWN);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [score] = useState<number>(0);
  const player = useRef<null | HTMLAudioElement>(null);

  useEffect(() => {
    reloadPlayer();
  }, [previewUrl]);

  const reloadPlayer = async () => {
    if (player && player.current) {
      player.current.pause();
      player.current.src = previewUrl;
      await player.current.play();
    }
  };

  const onQuestionUpdateReceived = async (
    question: QuestionUpdateMessage
  ): Promise<void> => {
    setStep(IGameEnum.QUIZZ);
    setAnswers(question.answers);
    setPreviewUrl(question.previewUrl);
  };

  const onAnswerResultReceived = ({ isCorrect }: AnswerResultMessage): void => {
    setIsAnswerCorrect(isCorrect);
    setStep(IGameEnum.ANSWER_SUBMITTED);
  };

  const onGameEndReceived = ({ gameId }: GameEndMessage): void => {
    history.push(`/leaderboard?gameId=${gameId}`);
  };

  const countdownMs = querystring.parse(location.search).countdownMs as string;

  ConnectionManager.getInstance().registerCallbackForMessage(
    MessageType.QUESTION_UPDATE,
    onQuestionUpdateReceived
  );

  ConnectionManager.getInstance().registerCallbackForMessage(
    MessageType.ANSWER_RESULT,
    onAnswerResultReceived
  );

  ConnectionManager.getInstance().registerCallbackForMessage(
    MessageType.GAME_END,
    onGameEndReceived
  );

  const handleAnswer = (answer: Answer): void => {
    ConnectionManager.getInstance().sendMessage({
      accessToken: getToken(),
      answer,
      gameId: querystring.parse(location.search).gameId as string,
      type: MessageType.SUBMIT_ANSWER,
    });
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
      {step === IGameEnum.ANSWER_SUBMITTED && (
        <AnswerResult isCorrect={isAnswerCorrect} />
      )}
      {step === IGameEnum.SCORE && <Score score={score} />}
    </div>
  );
};

export default withRouter(Game);
