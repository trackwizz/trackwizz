import React from "react";

import ChooseNumber from "../ChooseNumber";
import "./gameLength.css";

interface IGameLength {
  numberSongsTen: number;
  setNumberSongsTen: (value: number) => void;
  numberSongsUnit: number;
  setNumberSongsUnit: (value: number) => void;
}

const GameLength: React.FC<IGameLength> = ({
  numberSongsTen,
  setNumberSongsTen,
  numberSongsUnit,
  setNumberSongsUnit,
}: IGameLength): JSX.Element => {
  return (
    <div className="gameLengthContainer">
      <h1 className="gameLengthTitle">Choose the number of songs to play</h1>
      <div className="numbersSelectionContainer">
        <ChooseNumber number={numberSongsTen} setNumber={setNumberSongsTen} />
        <ChooseNumber number={numberSongsUnit} setNumber={setNumberSongsUnit} />
        <div className="allSongsInfo">
          Select 00 to play all the songs in the playlist!
        </div>
      </div>
    </div>
  )
}

export default GameLength;
