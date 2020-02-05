import React from "react";

interface IAnswerResult {
  isCorrect: boolean;
}

const AnswerResult: React.FC<IAnswerResult> = ({
  isCorrect
}: IAnswerResult) => {
  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Result:</h2>
        <h1 className="fancy-text">
          The answer is {isCorrect ? "correct =)" : "wrong =("}
        </h1>
        <div>Waiting for next question.</div>
      </div>
    </div>
  );
};

export default AnswerResult;
