import React from "react";

interface IRemainingPlayTime {
  remainingPlayTimeSeconds: number;
}

const RemainingPlayTime: React.FC<IRemainingPlayTime> = ({
  remainingPlayTimeSeconds
}: IRemainingPlayTime) => {
  return (
    <div>
      <h2 className="fancy-text">{remainingPlayTimeSeconds}</h2>
    </div>
  );
};

export default RemainingPlayTime;
