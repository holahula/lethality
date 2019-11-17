import '../css/play.css';
import React from 'react';

import samplecard from '../img/cards/01DE009.png';

export default function Play() {
    return (
        <div className="Game-columns">
            <div className="Board-column">
                <div className="Opponent">
                    <div className="Opponent-bench">
                        <span className="Description-font">OPPONENT BENCH</span>
                    </div>
                    <div className="Opponent-board">
                        <span className="Description-font">OPPONENT BOARD</span>
                    </div>
                </div>
                
                <div className="Spells">

                </div>

                <div className="Player">
                    <div className="Player-board">
                        <span className="Description-font">PLAYER BOARD</span>
                        
                        <div className="Board-row">
                            <img src={samplecard} className="Board-card"/>
                            <img src={samplecard} className="Board-card"/>
                            <img src={samplecard} className="Board-card"/>
                            <img src={samplecard} className="Board-card"/>
                            <img src={samplecard} className="Board-card"/>
                            <img src={samplecard} className="Board-card"/>
                        </div>

                    </div>
                    <div className="Player-bench">
                        <span className="Description-font">PLAYER BENCH</span>

                        <div className="Bench-row">
                            <img src={samplecard} className="Bench-card"/>
                            <img src={samplecard} className="Bench-card"/>
                            <img src={samplecard} className="Bench-card"/>
                            <img src={samplecard} className="Bench-card"/>
                            <img src={samplecard} className="Bench-card"/>
                            <img src={samplecard} className="Bench-card"/>
                        </div>
                        

                    </div>
                </div>
            </div>
        </div>
    );
}