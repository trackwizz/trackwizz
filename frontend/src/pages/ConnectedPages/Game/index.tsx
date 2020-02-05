import React, { useState, useRef, useEffect, useContext } from "react";
import querystring from "query-string";
import "./game.css";
import Countdown from "./Countdown";
import { IGameEnum } from "./types";
import { RouteComponentProps, withRouter } from "react-router-dom";
import MessageType, {
  QuestionUpdateMessage,
  Answer,
  AnswerResultMessage,
  GameEndMessage
} from "../../../websockets/MessageType";
import ConnectionManager from "../../../websockets/ConnectionManager";
import Question from "./Question";
import AnswerResult from "./AnswerResult";
import { adjustVolume } from "../../../utils/audio";
import { UserContext } from "../components/UserContext";

const Game: React.FC<RouteComponentProps> = ({ location, history }) => {
  const userContext = useContext(UserContext);
  const [step, setStep] = useState<IGameEnum>(IGameEnum.COUNTDOWN);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [remainingPlayTimeSeconds, setRemainingPlayTimeSeconds] = useState<
    number
  >(30);
  const [remainingPlayTimeoutId, setRemainingPlayTimeoutId] = useState<
    NodeJS.Timeout
  >();
  const player = useRef<null | HTMLAudioElement>(null);

  useEffect(() => {
    reloadPlayer().catch();
  }, [previewUrl]);

  const reloadPlayer = async (): Promise<void> => {
    if (player && player.current) {
      await adjustVolume(player.current, 0, { duration: 200 });
      player.current.pause();
      // eslint-disable-next-line require-atomic-updates
      player.current.src = previewUrl;
      await player.current.play();
      updateRemaingPlayTime(player.current.duration);
      await adjustVolume(player.current, 1, { duration: 200 });
    }
  };

  const updateRemaingPlayTime = (time: number) => {
    if (remainingPlayTimeoutId) {
      clearTimeout(remainingPlayTimeoutId);
    }
    const remainingPlayTime = Math.round(time);
    setRemainingPlayTimeSeconds(remainingPlayTime);
    if (remainingPlayTime >= 1) {
      const timeoutId = setTimeout(
        () => updateRemaingPlayTime(remainingPlayTime - 1),
        1000
      );
      setRemainingPlayTimeoutId(timeoutId);
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
    if (userContext.user) {
      ConnectionManager.getInstance().sendMessage({
        player: {
          id: userContext.user.id,
          name: userContext.user.display_name
        },
        answer,
        gameId: querystring.parse(location.search).gameId as string,
        type: MessageType.SUBMIT_ANSWER
      });
    }
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
        <Question
          previewUrl={previewUrl!}
          answers={answers!}
          handleAnswer={handleAnswer}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          remainingPlayTimeSeconds={remainingPlayTimeSeconds}
        />
      )}
      {step === IGameEnum.ANSWER_SUBMITTED && (
        <AnswerResult isCorrect={isAnswerCorrect} />
      )}
      <audio ref={player} data-vscid="obacc5arn" muted={isMuted} />
    </div>
  );
};

export default withRouter(Game);
