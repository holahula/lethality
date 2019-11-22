import '../css/play.css';
import '../css/create.css';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

import {
    reorderHand,
    cardMovedFromHandToBench,
    cardMovedFromBenchToBoard,
    cardMovedFromBoardToBench,

    hoveredOverCard,
    hoveredAwayFromCard,
    createButtonPressed,
} from '../actions/MainActions';

import { create_cardAdded, fieldUpdated, uploadLethal } from '../actions/CreateActions';

import useWindowDimensions from '../WindowDimensions';
import { booleanLiteralTypeAnnotation } from '@babel/types';


function updateParams(param, newvalue, dispatch) {
    const new_val = newvalue.target.value;
    dispatch(fieldUpdated(param, new_val));
}

function createOverlay(game_state, dispatch) {
    if (!game_state.custom_game_board.show_popup){return;}

    return (
        <div className="Create-overlay">
            <div className="WindowBG">
                <span className="Overlay-Header">Create Lethal</span>
                <table className="Overlay-table">
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>

                    <tr>
                        <td>
                            <div className="input-header">Opponent Health</div>
                            <input value={game_state.custom_game_board.o_health}
                                className="Field-input"
                                onChange={(value) => { updateParams("o_health", value, dispatch)}
                            } />

                        </td>
                        <td>
                            <div className="input-header">Player Health</div>
                            <input value={game_state.custom_game_board.p_health}
                            className="Field-input"
                            onChange={(value) => { updateParams("p_health", value, dispatch)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="input-header">Opponent Mana</div>
                            <input  value={game_state.custom_game_board.o_mana}
                            className="Field-input"
                            onChange={(value) => { updateParams("o_mana", value, dispatch)}}/>
                        </td>
                        <td>
                            <div className="input-header">Player Mana</div>
                            <input  value={game_state.custom_game_board.p_mana}
                            className="Field-input"
                            onChange={(value) => { updateParams("p_mana", value, dispatch)}}/>
                        </td>
                    </tr>
                </table>

                <div className="Button-submit" onClick={(evt) => {
                    dispatch(uploadLethal(game_state))
                }}>PUBLISH</div>
            </div>
        </div>
    );
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
    if (!hover.card.cardCode) { return; }
    const imgURL = "https://storage.googleapis.com/lethality/cards/" + hover.card.cardCode + '-COMPRESSED.png';
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

    let hand = board.hand;
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



function renderPlayerBench(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        // let cardImage = require('../img/cards/' + card.cardCode + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.cardCode + '-sm.png';
        return (

                    <div>
                     <img

                        key={index}
                        index={index}
                        src={cardImage}
                        className="Bench-card"

                        onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                        onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                        onMouseLeave={(event) => onMouseExit(event, dispatch)}
                     />
                    </div>
                )
        })

    if (render_obj == null) { return emptyDraggable() }
    return render_obj;
}


function renderPlayerHand(board, dispatch) {
    let cards = board.hand
    let render_obj = cards.map( (card, index) => {
        //let cardImage = require('../img/cards/' + card.cardCode + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.cardCode + '-sm.png';
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

                        onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                        onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                        onMouseLeave={(event) => onMouseExit(event, dispatch)}

                        style={{...provided.draggableProps.style,
                            ...updateCardSize(snapshot)
                        }}

                        />
                )}
            </Draggable>
            
        );
    });
    return render_obj;
}

function updateCardSize(snapshot) {
    switch(snapshot.draggingOver) {
        case "player_bench":
            return {
                height: "105px",
                width: "auto",
            }
        case "opponent_bench":
                return {
                    height: "105px",
                    width: "auto",
                }
        case "opponent_board":
                return {
                    height: "140px",
                    width: "auto"
                }
        case "player_board":
            return {
                height: "140px",
                width: "auto"
            }
        default:
            return {}
    }
}

function renderPlayerBoard(cards, dispatch) {

    const showHealthIndicator = (snapshot) => {
        // hide health indicator on card when dragging
        return {
            opacity: snapshot.isDragging ? "0" : "100",
            display: snapshot.isDragging ? "none" : "flex"
        }
    }
    let render_obj = cards.map( (card, index) => {
        // let cardImage = require('../img/cards/' + card.cardCode + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.cardCode + '-sm.png';
        return (

                    <div>
                    <img

                        index={index}
                        key={index}
                        src={cardImage}
                        className="Board-card"

                        onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                        onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                        onMouseLeave={(event) => onMouseExit(event, dispatch)}
                    />
                    <div className="Board-card-health"
                    onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
                    onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
                    onMouseLeave={(event) => onMouseExit(event, dispatch)}
                    >
                        <span className="Board-card-health-text">{card.health}</span>
                    </div>
                    </div>

        );
    });
    return render_obj;
}

function emptyDraggable() {
    return (
        <Draggable key="0" index="0" draggableId="0" style={{height: "100px", width: "50px"}}>
        </Draggable>
    );
}


function renderOpponentBench(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        //let cardImage = require('../img/cards/' + card.cardCode + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.cardCode + '-sm.png';
        return <img index={index} src={cardImage} className="Bench-card No-grab"
            key={index}
            onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
            onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
            onMouseLeave={(event) => onMouseExit(event, dispatch)}
        />;
    });
    return render_obj;
}

function renderOpponentBoard(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        //let cardImage = require('../img/cards/' + card.cardCode + '.png');
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card.cardCode + '-sm.png';
        return <img key={index} index={index} src={cardImage} className="Board-card No-grab"
            onMouseEnter={(event) => onMouseEnter(event, card, dispatch)}
            onMouseMove= {(event) => hoverOverCard(event, card, dispatch)}
            onMouseLeave={(event) => onMouseExit(event, dispatch)}
        />;
    });
    return render_obj;
}

function renderSpells(cards, dispatch) {
    let render_obj = cards.map( (card, index) => {
        const url = "https://storage.googleapis.com/lethality/cards/" + card.cardCode + '.png';
        return (
            <img key={index} className="One-spell" index={index} src={url}
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

function renderManaSpellIndicators(mana) {
    let mana_to_arr = [];
    for (let i=0; i<3; i++){
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

function renderLibraryCards(cards, dispatch) {

    let library = cards.map( (card, index) => {
        let cardImage = "https://storage.googleapis.com/lethality/cards/" + card + '-sm.png';
        return (
            <Draggable key={index} index={index} draggableId={card}>
                {(provided, snapshot) => (
                    <img className="Card-library-card"
                        ref={provided.innerRef}
                        src={cardImage}

                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{...provided.draggableProps.style,
                            ...updateCardSize(snapshot)
                        }}
                    />
                )}
            </Draggable>
        )
    });
    return library;
}



const onDragEndLib = (result, board, dispatch, library_index_to_card) => {
    const {source, destination} = result; 
    if (!destination) { return; }
    if (!source) { return; }

    if (source.droppableId === "library") {
        console.log(source);

        const card = library_index_to_card[source.index]
        dispatch(create_cardAdded(destination.droppableId, card, board));

        switch(destination.droppableId){

            case "opponent_bench":
                console.log("obench");
                dispatch(create_cardAdded(destination.droppableId, card, board));
                break;
            case "opponent_board":
                console.log("oboard");
                dispatch(create_cardAdded(destination.droppableId, card, board));
                break;
            case "player_bench":
                console.log("pbench");
                dispatch(create_cardAdded(destination.droppableId, card, board));
                break;
            case "player_board":
                console.log("pboard");
                dispatch(create_cardAdded(destination.droppableId, card, board));
                break;
            case "player_hand":
                console.log('phand');
                dispatch(create_cardAdded(destination.droppableId, card, board));
            default:
        }
    }
}

function Create({game_state, dispatch}) {

    let board = game_state.custom_game_board;

    let hover = game_state.hover;
    let spells = game_state.custom_game_board.spell_stack;

    let library_cards = game_state.library_cards;

    // map index to card id
    let library_index_to_card={}
    for(let i=0;i<library_cards.length; i++){
        library_index_to_card[i] = library_cards[i];
    }

    const {width, height} = useWindowDimensions();
    return (
            <DragDropContext onDragEnd={
                (result) => onDragEndLib(result, board, dispatch, library_index_to_card)}>

            <div className="Game">
            {createOverlay(game_state, dispatch)}
                <img className="Hover-card"
                    src={getHoverCardURL(hover)}
                    style={getHoverCardStyle(hover)}/>
                <div className="Game-columns Game-columns-override" style={{height: height-70}}>


                    <div className="Card-library">
                        <div className="Card-library-title">CARD LIBRARY</div>

                        <Droppable droppableId="library">
                            {(provided, snapshot) => (
                                <div className="Card-library-list" ref={provided.innerRef}>
                                    {renderLibraryCards(library_cards, dispatch)}
                                    {provided.placeholder}
                                </div>
                            )}
                            
                        </Droppable>

                       
                    </div>

                    <div className="Board-column">
                        <div className="Opponent">
                            <Droppable droppableId="opponent_bench" direction="horizontal">
                                {(provided, snapshot) => (
                                    <div className="Opponent-bench">
                                        <span className="Description-font">OPPONENT BENCH</span>
                                        <div className="Bench-row"  ref={provided.innerRef}>
                                            {renderOpponentBench(board.o_bench, dispatch)}
                                            <div style={{opacity: "0%"}}>
                                                    {provided.placeholder}
                                                    </div>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                            <Droppable droppableId="opponent_board" direction="horizontal">
                                {(provided, snapshot) => (
                                     <div className="Opponent-board">
                                        <div className="Opponent-board-main">
                                            <span className="Description-font">OPPONENT BOARD</span>
                                            <div className="Board-row"  ref={provided.innerRef}>
                                                {renderOpponentBoard(board.o_board, dispatch)}
                                                <div style={{opacity: "0%"}}>
                                                    {provided.placeholder}
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        
                        <div className="Spells">
                            {renderSpells(spells, dispatch)}
                        </div>

                        <div className="Player">
                                <Droppable droppableId="player_board" direction="horizontal">
                                    {(provided, snapshot) => (

                                        <div className="Player-board">

                                        
                                            
                                            <div className="Player-board-main">
                                                <span className="Description-font">PLAYER BOARD</span>
                                                <div className="Board-row" ref={provided.innerRef}>
                                                    {renderPlayerBoard(board.p_board, dispatch)}
                                                    <div style={{opacity: "0%"}}>
                                                    {provided.placeholder}
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>

                                <Droppable droppableId="player_bench" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Player-bench">
        
                                            <span className="Description-font">PLAYER BENCH</span>
                                            <div className="Bench-row"  ref={provided.innerRef} {...provided.droppableProps}>
                                                {renderPlayerBench(board.p_bench, dispatch)}
                                                <div style={{opacity: "0%"}}>
                                                    {provided.placeholder}
                                                    </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                               
                                <Droppable droppableId="player_hand" direction="horizontal">
                                    {(provided, snapshot) => (
                                        <div className="Deck" ref={provided.innerRef} {...provided.droppableProps}>
                                            {renderPlayerHand(board, dispatch)}
                                            <div style={{opacity: "0%"}}>
                                                    {provided.placeholder}
                                                    </div>
                                        </div>
                                    )}
                                    
                                </Droppable>

                        </div>
                    </div>


                    <div className="Right-col">
                        <img  onClick={(evt) => {
                    dispatch(createButtonPressed())
                }} src={require('../img/CREATE.png')} className="Create-btn"/>
                    </div>
                </div>

            </div>
        </DragDropContext>
    );
}

const mapStateToProps = state => {
    return {
        game_state: state,
    }
}

export default connect(mapStateToProps)(Create);