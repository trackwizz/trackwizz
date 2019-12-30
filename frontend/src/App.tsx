import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ConnectedPages from "./pages/ConnectedPages";

const App: React.FC = () => {
  return (
    <div className="main-container">
      <Navbar />
      <div className="flex-1">
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={ConnectedPages} />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default App;
