import Cards from '../Cards.json';
import uuid from 'uuid/v4';
import Axios from 'axios';
import { ENDPOINT } from '../constants.js';

// ACTIONS FOR CREATING LETHAL
export const CARD_MOVED = "MAKE_CARD_MOVED";
export const CARD_ADDED = "MAKE_CARD_ADDED";
export const CARD_REMOVED = "MAKE_CARD_REMOVED";
export const FIELD_UPDATED = "FIELD_UPDATED2";

export const PUZZLE_CREATED = "PUZZLE_CREATED";

export function uploadLethal(state){
    return dispatch => {
        let puzzle = state.custom_game_board;
        delete puzzle.show_popup;
        puzzle.elo = state.elo;
        puzzle.puzzle_id= uuid();

        console.log(JSON.stringify(puzzle));

        // post
        Axios.post(ENDPOINT+'puzzle', {
            ...puzzle
        })
        .then(response => {
            console.log(response);
            // once the puzzle is created, load it in
            dispatch({
                type: PUZZLE_CREATED
            })
            alert("puzzle created!");
        })
        .catch(err => {
            console.error(err);
        })
    }
}

export function fieldUpdated(destination, value) {
    return {
        type: FIELD_UPDATED,
        text: value,
        destination
    }
}

export function create_cardAdded(destination, card_id, board) {
    return dispatch => {
        console.log(destination, card_id, board);

        let new_card = {... Cards[card_id]};
        new_card.uuid = uuid();
        // get card data
        // add card to board
            var new_bench;
            var new_board;
            switch(destination) {
                case "player_bench":
                    new_bench = Array.from(board.p_bench);
                    new_bench.push(new_card);
                    // dispatch
                    dispatch(
                        {
                            type: CARD_ADDED,
                            destination,
                            new_bench
                        })
                    break;
                case "opponent_bench":
                    new_bench = Array.from(board.o_bench);
                    new_bench.push(new_card);
                    // dispatch
                    dispatch(
                        {
                            type: CARD_ADDED,
                            destination,
                            new_bench
                        })
                    break;
                case "opponent_board":
                    new_board = Array.from(board.o_board);
                    new_board.push(new_card);
                    // dispatch
                    dispatch(
                        {
                            type: CARD_ADDED,
                            destination,
                            new_board
                        })
                    break;
                case "player_board":
                    new_board = Array.from(board.p_board);
                    new_board.push(new_card);
                    // dispatch
                    dispatch(
                        {
                            type: CARD_ADDED,
                            destination,
                            new_board
                        })
                    break;
                case "player_hand":
                        let new_hand = Array.from(board.hand);
                        new_hand.push(new_card);
                        // dispatch
                        dispatch(
                            {
                                type: CARD_ADDED,
                                destination,
                                new_hand
                            })
                        break;
                default:
                    return;
            }
    }
 }

 export function create_cardMoved(source, destination, card, board) {

 }

 export function create_cardRemoved(source, card, board) {

 }