import { connect } from 'react-redux';
import '../App.css';
import React from 'react';

import logo from '../img/Logo.png';
import { userSignedIn, updateUsernameField } from '../actions/MainActions';

function checkUserSigendIn (isSignedIn){
    return {
        display: isSignedIn == true ? "none" : "flex"
    }
}

function updateUsernameField_L(event, dispatch) {
    let text = event.target.value;
    dispatch(updateUsernameField(text));
}

function signIn(username, dispatch) {
    console.log("Sign in as " + username);
    dispatch(userSignedIn(username))
}


function Signin({isSignedIn, username, dispatch}) {
    return (
        <div className="Login-container" style={checkUserSigendIn(isSignedIn)}>
            <div className="Login-box">
                <div className="Login-field">
                    <img src={logo} className="Logo" />
                    <div className="Input-container">
                        <input className="Input-field"
                        placeholder="ENTER A USERNAME"
                        value={username}
                        onChange={(event) => updateUsernameField_L(event, dispatch)} />

                        <div className="Input-button" onClick={(event) => {signIn(username, dispatch)}}>
                            <span className="Input-button-text">  
                                &rarr;
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isSignedIn: state.isSignedIn,
    username: state.username
});

export default connect(mapStateToProps)(Signin);