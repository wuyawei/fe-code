import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import './App.css';
const About = lazy(() => import('./about'));
const Game = lazy(() => import('./game'));
const Calendar = lazy(() => import('./Calendar'));

function AppRouter() {
  return (
    <Router>
        <Link to="/about">about</Link>
        <br/>
        <Link to="/calendar">calendar</Link>
        <br/>
        <Link to="/game">game</Link>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
              <Route path="/about" component={About} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/game" component={Game} />
          </Switch>
        </Suspense>
        <div className='box'>
          <div className='one'></div>
          <div className='two'></div>
        </div>
    </Router>
  );
}

export default AppRouter;