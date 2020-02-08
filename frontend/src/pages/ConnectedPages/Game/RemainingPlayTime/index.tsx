import React from "react";

interface IRemainingPlayTime {
  remainingPlayTimeSeconds: number;
  remainingPlayers: number;
}

const RemainingPlayTime: React.FC<IRemainingPlayTime> = ({
  remainingPlayTimeSeconds,
  remainingPlayers
}: IRemainingPlayTime): JSX.Element => {
  return (
    <div>
      <h2 className="fancy-text">
        {remainingPlayTimeSeconds}
        {remainingPlayers !== -1
          ? ` - ${remainingPlayers} player${
              remainingPlayers > 1 ? "s" : ""
            } in game`
          : ""}
      </h2>
    </div>
  );
};

export default RemainingPlayTime;
