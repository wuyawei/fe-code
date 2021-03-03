import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import 'antd-mobile/dist/antd-mobile.css'; 
import './App.css';
const About = lazy(() => import('./About'))
const Game = lazy(() => import('./Game'));
const Calendar = lazy(() => import('./Calendar/index'));
const Touch = lazy(() => import('./Touch'));
const Carousel = lazy(() => import('./Carousel'));
const Test = lazy(() => import('./Test/index'));
const ToScroll = lazy(() => import('./ToScroll/index'));
const Lazy = lazy(() => import('./Lazy'));
const Ability = lazy(() => import('./Ability'));

function AppRouter() {
  return (
    <Router>
        {/* <Link to="/about">about</Link>
        <br/>
        <Link to="/calendar">calendar</Link>
        <br/>
        <Link to="/game">game</Link>
        <br/>
        <Link to="/touch">touch</Link>
        <br/>
        <Link to="/carousel">carousel</Link>
        <br/>
        <Link to="/test">test</Link> */}
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
              <Route path="/about" component={About} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/game" component={Game} />
              <Route path="/touch" component={Touch} />
              <Route path="/carousel" component={Carousel} />
              <Route path="/test" component={Test} />
              <Route path="/scroll" component={ToScroll} />
              <Route path="/Lazy" component={Lazy} />
              <Route path="/ability" component={Ability} />
          </Switch>
        </Suspense>
    </Router>
  );
}

export default AppRouter;