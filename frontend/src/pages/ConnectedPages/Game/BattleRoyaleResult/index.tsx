import React from "react";

interface IAnswerResult {
  won: boolean;
  position: number;
  goToLeaderBoard: () => void;
}

const BattleRoyaleResult: React.FC<IAnswerResult> = ({
  won,
  position,
  goToLeaderBoard
}: IAnswerResult): JSX.Element => {
  return (
    <div className="flex-container column">
      <div className="text-center">
        <h1 className="fancy-text">
          {won ? "You WON !!! :)" : "Game over..."}
        </h1>
        {!won && (
          <div style={{ marginBottom: "1rem" }}>Your position: {position}</div>
        )}
        <button onClick={goToLeaderBoard}>Go to leaderboard</button>
      </div>
    </div>
  );
};

export default BattleRoyaleResult;
