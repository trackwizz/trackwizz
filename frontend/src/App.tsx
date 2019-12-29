import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="main-container">
      <Navbar />
      <div className="flex-1">
        <Router>
          <Switch>
            <Route path="/game" component={Game} />
            <Route path="/login" component={Login} />
            <Route path="/" component={Home} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default App;
