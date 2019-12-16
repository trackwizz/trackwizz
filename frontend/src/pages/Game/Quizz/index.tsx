import React from "react";
import dancers from "../../../utils/dancers";
import "./quizz.css";

const Quizz: React.FC<{ choices: string[] }> = ({ choices }) => {
  const dancer: string = dancers[Math.floor(Math.random() * dancers.length)];

  return (
    <div className="flex-container column">
      <div className="text-center">
        <h2 className="fancy-text">Which music is currently playing?</h2>
        <img height="180px" src={dancer} alt="test" />
      </div>
      <div className="grid-container">
        <div>
          <div className="grid">
            {choices.map((c, index) => (
              <button key={index}>{c}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizz;
