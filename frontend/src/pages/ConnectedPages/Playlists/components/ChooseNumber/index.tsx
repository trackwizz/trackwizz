import React from "react";

import "./chooseNumber.css";

interface IChooseNumber {
  number: number,
  setNumber: (value: number) => void;
}

const ChooseNumber: React.FC<IChooseNumber> = ({
  number,
  setNumber,
}: IChooseNumber): JSX.Element => {
  const incrNumber = (): void => {
    setNumber((((number + 1) % 10) + 10) % 10);
  }

  const decrNumber = (): void => {
    setNumber((((number - 1) % 10) + 10) % 10);
  }

  return (
    <div className="chooseNumberContainer">
      <button
        className="chooseNumberButton"
        onClick={incrNumber}
      >
        🔺
      </button>
      <div className="currentNumber">{number}</div>
      <button
        className="chooseNumberButton"
        onClick={decrNumber}
      >
        🔻
      </button>
    </div>
  )
}

export default ChooseNumber;
