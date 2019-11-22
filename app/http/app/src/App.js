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
import WinScreen from './modules/WinScreen';
import useWindowDimensions from './WindowDimensions';

function blurIfNeeded(isSignedIn, showWinScreen){
  return {
    filter: (!isSignedIn | showWinScreen)  ? "blur(15px)" : "blur(0px)",
  }
}

function App({isSignedIn, showWinScreen}) {
  const {width, height} = useWindowDimensions();
  return (
    <Router>
      <Signin />
      <WinScreen />

      <div className="App-body"
      style={{
        ...blurIfNeeded(isSignedIn, showWinScreen),
        
        }}>

        <Header />
        <Switch>
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
    showWinScreen: state.showWinScreen
  }
}

export default hot(connect(mapStateToProps)(App));