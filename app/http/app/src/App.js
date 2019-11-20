import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from 'react';

import Header from './modules/header';
// css
import './App.css';

// routes
import Play from './routes/play';
import Create from './routes/create';
import Rankings from './routes/rankings';
import Signin from './modules/Signin';

function hideBlurIfSignedIn(isSignedIn){
  return {
    filter: isSignedIn ? "blur(0px)" : "blur(15px)",
  }
}

function App({isSignedIn}) {
  return (
    <Router>
      <Signin />
      <div className="App-body" style={hideBlurIfSignedIn(isSignedIn)}>
        <Header />
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
      </div>

      
    </Router>


  );
}

const mapStateToProps = state => {
  return {
    isSignedIn: state.isSignedIn,
  }
}

export default hot(connect(mapStateToProps)(App));