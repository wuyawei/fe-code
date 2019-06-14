import React from "react";
import About from './about';
import Game from './game';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function AppRouter() {
  return (
    <Router>
        <Switch>
            <Route path="/about" component={About} />
            <Route path="/" component={Game} />
        </Switch>
    </Router>
  );
}

export default AppRouter;