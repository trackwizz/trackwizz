import React from "react";
import {Redirect} from "react-router";
import {isLoggedIn} from "../utils/auth";


const Home: React.FC = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />
  }

  return (
    <div>Home!</div>
  );
};

export default Home;
