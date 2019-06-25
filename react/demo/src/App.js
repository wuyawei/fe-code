import React from "react";
import About from './about';
import Game from './game';
import Calendar from './Calendar';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function AppRouter() {
  return (
    <Router>
      
        <Link to="/about">about</Link>
        <br/>
        <Link to="/calendar">calendar</Link>
        <br/>
        <Link to="/game">game</Link>
        <Switch>
            <Route path="/about" component={About} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/game" component={Game} />
        </Switch>
    </Router>
  );
}

export default AppRouter;