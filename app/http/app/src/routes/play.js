import '../css/play.css';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

import {
    reorderHand,
    cardMovedFromHandToBench,
    cardMovedFromBenchToBoard,
    cardMovedFromBoardToBench,

    hoveredOverCard,
    hoveredAwayFromCard
} from '../actions/MainActions';

function onDragEnd (result, board, dispatch) {
    const {source, destination} = result;
    if (!destination){return}

    if (source.droppableId === destination.droppableId) {
        // source = destination
        switch(source.droppableId) {
            case "hand":
                // re-order the cards in hand
                dispatch(reorderHand(board, source.index, destination.index));
                return;
            default:
                return;
        }
        // re-order the cards in hand
    }

    if (source.droppableId === "hand" && destination.droppableId === "bench") {
        dispatch(cardMovedFromHandToBench(board, source.index));
    }

    if (source.droppableId === "bench" && destination.droppableId === "board") {
        dispatch(cardMovedFromBenchToBoard(board, source.index));
    }

    if (source.droppableId === "board" && destination.droppableId === "bench") {
        dispatch(cardMovedFromBoardToBench(board, source.index));
    }
}

function onMouseEnter(data, card, dispatch) {
    dispatch(hoveredOverCard(card, data.clientX, data.clientY));
}
function onMouseExit(data, dispatch) {
    dispatch(hoveredAwayFromCard());
}
function hoverOverCard(data, card, dispatch) {
    dispatch(hoveredOverCard(card, data.clientX, data.clientY));
}

function getHoverCardURL(hover) {
    if (!hover.card.card_id) { return; }
    const imgURL = "https://storage.googleapis.com/lethality/cards/" + hover.card.card_id + '-COMPRESSED.png';
    return imgURL;
}
function getHoverCardStyle(hover) {
    let top = hover.y - 370;
    if(top < 20) {
        top = hover.y - 15;
    }
    const style = {
        display: hover.visible? "block" : "none",
        left: hover.x+20,
        top: top,
    }
    return style;
}

function draggingOverBench(snapshot, board) {

    let hand = board.cards_in_hand;
    let p_board = board.p_board;
    // show "move to bench" UI if the card is from the hand
    let is_valid_card = false;
    for (let i=0; i<hand.length; i++){
        if (hand[i].uuid === snapshot.draggingOverWith) {
            is_valid_card = true;
            break;
        }
    }

    // or if the card is from the board
    for (let i=0; i<p_board.length; i++){
        if (p_board[i].uuid === snapshot.draggingOverWith) {
            is_valid_card = true;
            break;
        }
    }

    return {
        display: (snapshot.isDraggingOver && is_valid_card) ? "flex": "none"
    }
}

function draggingOverBoard(snapshot, board) {
    // return { display: "flex" } // use for designing layout
    let bench = board.p_bench;
    let is_card_from_deck = false;
    for (let i=0; i<bench.length; i++){
        if (bench[i].uuid === snapshot.draggingOverWith) {
            is_card_from_deck = true;
            break;
        }
    }

    return {
        display: (snapshot.isDraggingOver && is_card_from_deck) ? "flex": "none"
    }
}

function renderPlayerHand(board, dispatch) {
    let cards = board.cards_in_hand
    let render_obj = cards.map( (card, index) => {
        //let cardImage = require('../img/cards/' + card.card_id + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.card_id + '-sm.png';
        return (
            <Draggable key={card.uuid} index={index} draggableId={card.uuid}>
                {(provided, snapshot) => (
                    <img
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                        key={index}
                        src={cardImage}
                        className="Deck-card"

                        style={provided.draggableProps.style}

                        onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                        onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                        onMouseLeave={(event) => onMouseExit(event, dispatch)}

                        />
                )}
            </Draggable>
            
        );
    });
    return render_obj;
}


function renderPlayerBench(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        // let cardImage = require('../img/cards/' + card.card_id + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.card_id + '-sm.png';
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
                        className="Bench-card"

                        style={provided.draggableProps.style}

                        onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                        onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                        onMouseLeave={(event) => onMouseExit(event, dispatch)}
                     />
                    
                )}
               
            </Draggable>
        );
    });
    return render_obj;
}

function renderPlayerBoard(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        // let cardImage = require('../img/cards/' + card.card_id + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.card_id + '-sm.png';
        return (
            <Draggable key={card.uuid} index={index} draggableId={card.uuid}>
                {(provided, snapshot) => (
                    <img
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                        index={index}
                        key={index}
                        src={cardImage}
                        className="Board-card"
                        style={provided.draggableProps.style}

                        onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                        onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                        onMouseLeave={(event) => onMouseExit(event, dispatch)}
                    />
                )}
            </Draggable>
        );
    });
    return render_obj;
}


function renderOpponentBench(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        //let cardImage = require('../img/cards/' + card.card_id + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.card_id + '-sm.png';
        return <img index={index} src={cardImage} className="Bench-card No-grab"
            onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
            onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
            onMouseLeave={(event) => onMouseExit(event, dispatch)}
        />;
    });
    return render_obj;
}

function renderOpponentBoard(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        //let cardImage = require('../img/cards/' + card.card_id + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.card_id + '-sm.png';
        return <img index={index} src={cardImage} className="Board-card No-grab"
            onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
            onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
            onMouseLeave={(event) => onMouseExit(event, dispatch)}
        />;
    });
    return render_obj;
}

function renderSpells(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        const url = "https://storage.googleapis.com/lethality/cards/" + card.card_id + '.png';
        return (
            <img className="One-spell" index={index} src={url}
                onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                onMouseLeave={(event) => onMouseExit(event, dispatch)}
            />
        );
    });
    return render_obj;
}

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

function Play({game_state, dispatch}) {
    let board = game_state.game_state;
    let hover = game_state.hover;
    let spells = game_state.game_state.spell_stack;

    return (
            <div className="Game">
                <img className="Hover-card"
                    src={getHoverCardURL(hover)}
                    style={getHoverCardStyle(hover)}/>
                <div className="Game-columns">
                    <div className="Health-column">
                        <div className="Opponent-board-health">
                        <span className="Description-font">OPPONENT</span>
                            <div className="Opponent-board-health-indicator">
                                {board.o_health}
                            </div>
                        </div>
                        <div className="Player-board-health">
                            <span className="Description-font">YOU</span>
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
                                    {renderOpponentBench(board.o_bench, dispatch)}
                                </div>
                            </div>
                            <div className="Opponent-board">
                                <div className="Opponent-board-main">
                                    <span className="Description-font">OPPONENT BOARD</span>
                                    <div className="Board-row">
                                        {renderOpponentBoard(board.o_board, dispatch)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="Spells">
                            {renderSpells(spells, dispatch)}
                        </div>

                        <div className="Player">
                            <DragDropContext onDragEnd={(result) => onDragEnd(result, board, dispatch)}>

                                <Droppable droppableId="board" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Player-board">
                                            <div className="Player-board-overlay"style={draggingOverBoard(snapshot, board)}>
                                                <span className="Player-board-overlay-text">&uarr; PLAY CARD &uarr;</span>
                                            </div>

                                            <div className="Player-board-main">
                                                <span className="Description-font">PLAYER BOARD</span>
                                                <div className="Board-row" ref={provided.innerRef}>
                                                    {renderPlayerBoard(board.p_board, dispatch)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                <Droppable droppableId="bench" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Player-bench">
                                            <div className="Player-bench-overlay"style={draggingOverBench(snapshot, board)}>
                                                <span className="Player-bench-overlay-text">&rarr; MOVE TO BENCH &larr;</span>
                                            </div>
                                            <span className="Description-font">PLAYER BENCH</span>
                                            <div className="Bench-row"  ref={provided.innerRef} {...provided.droppableProps}>
                                                {renderPlayerBench(board.p_bench, dispatch)}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                               
                                <Droppable droppableId="hand" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Deck" ref={provided.innerRef} {...provided.droppableProps}>
                                            {renderPlayerHand(board, dispatch)}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                    
                                </Droppable>
                                
                            </DragDropContext>

                        </div>

                        
                        

                        
                    </div>

                    <div className="Right-column">

                        <div className="Opponent-mana">
                            <div className="Mana-background">
                                <span className="Mana-value">{board.o_mana}</span>
                                {renderManaIndicators(board.o_mana)}
                            </div>
                            <span className="Description-font">OPPONENT MANA</span>
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
        game_state: state,
    }
}

export default connect(mapStateToProps)(Play);