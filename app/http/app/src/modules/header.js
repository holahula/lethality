import {
    Link
  } from "react-router-dom";

import { connect } from 'react-redux';
import { changeUsername, changeElo } from '../actions/MainActions';

import '../App.css';
import React from 'react';
import logo from '../img/logo.png';
import powerOff from '../img/power-off.png';
import profileTeemo from '../img/profile_teemo.png';

function Header({changeUsername, username, elo}) {
        return (
          <div className="Header">
            <div>
              <img src={logo} className="Logo" />
            </div>
            <span className="Nav-bar">
              <Link className="Nav-item" to="/">PLAY</Link>
              <Link className="Nav-item" to="/rankings">RANKINGS</Link>
              <Link className="Nav-item" to="/feedback">FEEDBACK</Link>
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
                  <img src={powerOff} className="Power-off"/>
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

const mapDispatchToProps = dispatch => {
  return {
    changeUsername: () => dispatch(changeUsername("Mogen")),
    changeElo: (elo) => dispatch(changeElo(elo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);