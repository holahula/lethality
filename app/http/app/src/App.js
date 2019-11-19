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
import Create from './routes/create';
import Rankings from './routes/rankings';

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
        <Route path="/create">
          <Create />
        </Route>
        <Route path="/">
          <Play />
        </Route>
      </Switch>
    </Router>


  );
}

export default hot(App);