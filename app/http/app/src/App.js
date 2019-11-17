import { hot } from 'react-hot-loader/root';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from 'react';

import Header from './modules/header';
// routes
import Play from './routes/play';
import Rankings from './routes/rankings';
import Feedback from './routes/feedback';

function App() {
  return (
    <Router>
      <div className="App-body">
        <Header />
      </div>

      <Switch>
        <Route path="/rankings">
          <Rankings />
        </Route>
        <Route path="/feedback">
          <Feedback />
        </Route>
        <Route path="/">
          <Play />
        </Route>
      </Switch>
    </Router>


  );
}

export default hot(App);