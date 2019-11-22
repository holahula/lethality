import {
    Link
  } from "react-router-dom";

import { connect } from 'react-redux';
import { signOut } from '../actions/MainActions';

import '../App.css';
import React from 'react';
import logo from './../img/logo.png';
import powerOff from './../img/power-off.png';
import profileTeemo from './../img/profile_teemo.png';

function signOut_L(dispatch) {
  dispatch(signOut());
}

function Header({username, elo, dispatch}) {
        return (
          <div className="Header">
            <div>
              <img src={logo} className="Logo" />
            </div>
            <span className="Nav-bar">
              <Link className="Nav-item" to="/">PLAY</Link>
              <Link className="Nav-item" to="/create">CREATE</Link>
              <div className="User-profile">

                <div className="User-profile-data">
                  
                  <div>
                    <img src={profileTeemo} className="User-profile-data-pic"/>
                  </div>

                  <div className="User-profile-data-details">
                    <div className="User-profile-data-details-elo">
                      🔥{elo}
                    </div>
                    <div className="User-profile-data-details-username">
                      {username}
                    </div>
                  </div>
                </div>

                <div>
                  <img src={powerOff} className="Power-off" onClick={() => signOut_L(dispatch)}/>
                </div>

              </div>
            </span>
          </div>
      );
}
      
const mapStateToProps = (state) => {
  return {
    username: state.username,
    elo: state.elo
  }
}


export default connect(mapStateToProps)(Header);