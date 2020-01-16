import React, { useState } from "react";
import dancers from "../../../../utils/dancers";

interface IProps {
  className?: string;
}

const Dancers: React.FC<IProps> = ({ className }: IProps) => {
  const [dancer] = useState<string>(
    dancers[Math.floor(Math.random() * dancers.length)]
  );

  return <img height="180px" src={dancer} alt="dancer" className={className} />;
};

export default Dancers;
