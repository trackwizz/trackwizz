import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import ConnectedPages from "./pages/ConnectedPages";
import Navbar from "./components/Navbar";
import { UserProvider } from "./pages/ConnectedPages/components/UserContext";

const App: React.FC = () => {
  return (
    <div className="main-container">
      <div className="brand text-center">
        <h1 className="brand-name">Trackwizz</h1>
      </div>
      <div className="flex-1  height-100">
        <UserProvider>
          <Router>
            <Navbar />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={ConnectedPages} />
            </Switch>
          </Router>
        </UserProvider>
      </div>
    </div>
  );
};

export default App;
