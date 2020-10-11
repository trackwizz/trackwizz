import React from "react";

import ChooseNumber from "../ChooseNumber";
import { splitNumber } from "../..";
import { NumberOperation, NumberProperty } from "../../types";
import "./gameLength.css";

interface IGameLength {
  numberSongs: number;
  setNumberSongs: (np: NumberProperty) => (no: NumberOperation) => () => void;
}

const GameLength: React.FC<IGameLength> = ({
  numberSongs,
  setNumberSongs,
}: IGameLength): JSX.Element => {
  let [tens, unit] = splitNumber(numberSongs);
  return (
    <div className="gameLengthContainer">
      <h1 className="gameLengthTitle">Choose the number of songs to play</h1>
      <div className="numbersSelectionContainer">
        <ChooseNumber number={tens} setNumber={setNumberSongs("tens")} />
        <ChooseNumber number={unit} setNumber={setNumberSongs("unit")} />
        <div className="allSongsInfo">
          Select 00 to play all the songs in the playlist!
        </div>
      </div>
    </div>
  )
}

export default GameLength;
