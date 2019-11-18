import '../css/play.css';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import samplecard from '../img/cards/01DE009.png';
import deck_bg from '../img/deck-bg.png';

function renderManaIndicators(mana) {
    let mana_to_arr = [];
    for (let i=0; i<10; i++){
        if (i<mana) {
            // mana indicator will be filled
            mana_to_arr.push(1);
        } else {
            mana_to_arr.push(0);
        }
    }

    let render_obj = mana_to_arr.map( (val, index) => {
        if (val == 1) {
            return <div key={index} className="Mana-block-filled"></div>;
        } else {
            return <div key={index} className="Mana-block-unfilled"></div>;
        }
    });
    return render_obj;
}

function onDragEnd (result) {
    const {source, destination} = result;
    if (!destination){return}
    if (source.droppableId === destination.droppableId === "hand") {

    }
}

function reorderHand(board, index_old, index_new) {
    
}

function renderPlayerHand(cards, board) {
    let render_obj = cards.map( (card, index) => {
        let cardImage = require('../img/cards/' + card.card_id + '.png');
        return (
            <Draggable key={card.uuid} index={index} draggableId={card.uuid}>
                {(provided, snapshot) => (
                    <img
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                        key={index}
                        index={index}

                        src={cardImage}
                        className="Deck-card"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}/>
                )}
            </Draggable>
            
        );
    });
    return render_obj;
}

function renderOpponentBench(cards) {
    let render_obj = cards.map( (card, index) => {
        let cardImage = require('../img/cards/' + card.card_id + '.png');
        return <img index={index} src={cardImage} className="Bench-card No-grab"/>;
    });
    return render_obj;
}

function renderOpponentBoard(cards) {
    let render_obj = cards.map( (card, index) => {
        let cardImage = require('../img/cards/' + card.card_id + '.png');
        return <img index={index} src={cardImage} className="Board-card No-grab"/>;
    });
    return render_obj;
}

function renderPlayerBench(cards) {
    let render_obj = cards.map( (card, index) => {
        let cardImage = require('../img/cards/' + card.card_id + '.png');
        return <img index={index} src={cardImage} className="Bench-card"/>;
    });
    return render_obj;
}

function renderPlayerBoard(cards) {
    let render_obj = cards.map( (card, index) => {
        let cardImage = require('../img/cards/' + card.card_id + '.png');
        return <img index={index} src={cardImage} className="Board-card"/>;
    });
    return render_obj;
}

function Play({board}) {
    return (
            <div className="Game">

                <div className="Game-columns">
                    <div className="Health-column">
                        <div className="Opponent-board-health">
                            <span className="Description-font">OPPONENT HEALTH</span>
                            <div className="Opponent-board-health-indicator">
                                {board.o_health}
                            </div>
                        </div>
                        <div className="Player-board-health">
                            <span className="Description-font">PLAYER HEALTH</span>
                            <div className="Player-board-health-indicator">
                                {board.p_health}
                            </div>
                        </div>
                    </div>

                    <div className="Board-column">
                        <div className="Opponent">
                            <div className="Opponent-bench">
                                <span className="Description-font">OPPONENT BENCH</span>
                                <div className="Bench-row">
                                    {renderOpponentBench(board.o_bench)}
                                </div>
                            </div>
                            <div className="Opponent-board">
                                <div className="Opponent-board-main">
                                    <span className="Description-font">OPPONENT BOARD</span>
                                    <div className="Board-row">
                                        {renderOpponentBoard(board.o_board)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="Spells">
                            
                        </div>

                        <div className="Player">
                            <DragDropContext onDragEnd={onDragEnd}>

                                <Droppable droppableId="board" direction="horizontal">
                                    {(provided, snapshop) => (
                                        <div className="Player-board">
                                            <div className="Player-board-main">
                                                <span className="Description-font">PLAYER BOARD</span>
                                                <div className="Board-row" ref={provided.innerRef}>
                                                    {renderPlayerBoard(board.p_board)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                <Droppable droppableId="bench" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Player-bench">
                                            <span className="Description-font">PLAYER BENCH</span>
                                            <div className="Bench-row"  ref={provided.innerRef}>
                                                {renderPlayerBench(board.p_bench)}
                                            </div>
                                        </div>
                                    )}
                                    
                                </Droppable>
                               
                                <Droppable droppableId="hand" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Deck" ref={provided.innerRef}>
                                            {renderPlayerHand(board.cards_in_hand, board)}
                                        </div>
                                    )}
                                    
                                </Droppable>
                                
                            </DragDropContext>

                        </div>

                        
                        

                        
                    </div>

                    <div className="Right-column">

                        <div className="Opponent-mana">
                            <span className="Description-font">OPPONENT MANA</span>
                            <div className="Mana-background">
                                <span className="Mana-value">{board.o_mana}</span>
                                {renderManaIndicators(board.o_mana)}
                            </div>
                        </div>

                        <div className="Action-button-container">
                            <div className="Action-button">
                                <span className="Action-button-text">
                                    {board.action_button_text}
                                </span>
                            </div>
                        </div>

                        <div className="Player-mana">
                            <div className="Mana-background">
                                <span className="Mana-value">{board.p_mana}</span>
                                {renderManaIndicators(board.p_mana)}
                            </div>
                            <span className="Description-font">MANA</span>
                        </div>
                    </div>
                </div>

            </div>
    );
}

const mapStateToProps = state => {
    return {
        board: state.game_state,
    }
}

export default connect(mapStateToProps)(Play);