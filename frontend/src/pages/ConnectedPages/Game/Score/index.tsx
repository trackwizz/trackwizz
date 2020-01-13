import React from "react";

interface IScore {
  score: number;
}

const Score: React.FC<IScore> = ({ score }: IScore) => {
  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Score</h2>
        <span>{score}</span>
      </div>
    </div>
  );
};

export default Score;
