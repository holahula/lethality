import { connect } from 'react-redux';
import './../css/WinScreen.css';
import React from 'react';
import { userSignedIn } from '../actions/MainActions';

const shouldShowWinScreen = (showWinScreen) => {
    return {
        display: showWinScreen ? "flex" : "none",
    }
}

function WinScreen({showWinScreen, username, dispatch}) {
    return (
        <div className="WinScreen-container" style={shouldShowWinScreen(showWinScreen)}>
            <div className="WinScreen-window">

                <div>
                    <img className="Victory-image"
                     src="https://storage.googleapis.com/lethality/assets/victory.png"></img>
                </div>

                <div className="Header-text">
                    Victory!
                </div>

                <div className="Subtitle-text">
                    Are you up for one more?
                </div>

                <div className="Button-container">
                    <div className="Input-button"
                        onClick={() => dispatch(userSignedIn(username))
                    }>
                            <span className="Input-button-text">No</span>
                        </div>
                    <div className="Input-button"
                         onClick={() => dispatch(userSignedIn(username))}
                    >
                        <span className="Input-button-text">Yes</span>
                    </div>
                </div>
                
            </div>
        </div>
    );

}

const mapStateToProps = (state) => ({
    showWinScreen: state.showWinScreen,
    username: state.username,
});

export default connect(mapStateToProps)(WinScreen);