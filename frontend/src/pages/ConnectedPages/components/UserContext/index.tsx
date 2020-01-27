import React, { useState } from "react";
import { IUser } from "./types";

interface ICreateContext {
  user: undefined | IUser;
  setUser: undefined | React.Dispatch<undefined | IUser>;
}

const UserContext = React.createContext<ICreateContext>({
  user: undefined,
  setUser: undefined
});

interface IProps {
  children: React.ReactNode;
}

function UserProvider({ children }: IProps) {
  const [user, setUser] = useState<undefined | IUser>(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
