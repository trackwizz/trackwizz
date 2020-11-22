import React from "react";

import { NumberOperation } from "../../types";
import "./chooseNumber.css";

interface IChooseNumber {
  number: number,
  setNumber: (no: NumberOperation) => () => void;
}

const ChooseNumber: React.FC<IChooseNumber> = ({
  number,
  setNumber,
}: IChooseNumber): JSX.Element => {

  return (
    <div className="chooseNumberContainer">
      <button
        className="chooseNumberButton"
        onClick={setNumber("add")}
      >
        🔺
      </button>
      <div className="currentNumber">{number}</div>
      <button
        className="chooseNumberButton"
        onClick={setNumber("sub")}
      >
        🔻
      </button>
    </div>
  )
}

export default ChooseNumber;
