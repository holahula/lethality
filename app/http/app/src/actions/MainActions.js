import Cards from '../Cards.json';
import { ENDPOINT } from '../constants';

const Axios = require('axios');
const uuid = require('uuid/v4');

/*
 * Action types
*/
export const CHANGE_USERNAME = "CHANGE_USERNAME";
export const CHANGE_ELO = "CHANGE_ELO";
export const REORDER_HAND = "REORDER_HAND";
export const MOVED_TO_BENCH = "MOVED_TO_BENCH";
export const MOVED_TO_BOARD = "MOVED_TO_BOARD";

export const HOVERED_OVER_CARD = "HOVERED_OVER_CARD";
export const HOVERED_AWAY_FROM_CARD = "HOVERED_AWAY_FROM_CARD";;

export const USER_SIGNED_IN = "USER_SIGNED_IN";
export const USERNAME_FIELD_CHANGED = "USERNAME_FIELD_CHANGED";
export const USER_SIGNED_OUT = "USER_SIGNED_OUT";
export const PUZZLE_LOADED = "PUZZLE_LOADED";
export const GO_BUTTON_PRESSED = "GO_BUTTON_PRESSED";

export const BOARD_RECEIVED = "BOARD_RECEIVED";

export const GAME_WON = "GAME_WON";


export const CREATE_BUTTON_PRESSED = "CREATE_BUTTON_PRESSED";




/*
 * Action creators
 */

// let action = {
//     type: BOARD_RECEIVED,
//     board: 
// }

 export function createButtonPressed() {
    return {
        type: CREATE_BUTTON_PRESSED,
    }
 }

 export function signOut() {
     return {
        type: USER_SIGNED_OUT,
     }
 }

 export function updateUsernameField(username) {
    return {
        type: USERNAME_FIELD_CHANGED,
        username
    }
 }

 export function userSignedIn(username) {
    return dispatch => {

        // fetch("http://localhost:4433/user", {
        //     method: 'get',
        //     mode: 'cors',
        // })

        // dispatch({
        //     type: USER_SIGNED_IN,
        //     username,
        //     elo: 1000,
        // });

        console.log("Attempting to login");

        Axios.get(ENDPOINT+'user/'+username)
        .then(login_res => {
            const username = login_res.data.user_id;
            const elo = login_res.data.elo;
            console.log("Logged in");
            dispatch({
                type: USER_SIGNED_IN,
                username,
                elo
            })
                        
            // get puzzle
            Axios.get(ENDPOINT+"puzzles/"+elo)
            .then(puzzle_res => {
                console.log("Got puzzle");
                console.log(puzzle_res.data);
                dispatch({
                    type: PUZZLE_LOADED,
                    puzzle: puzzle_res.data
                })
            })
            .catch(err => {
                console.error(err);
            })

        })
        .catch(err => {
            console.log(err)
            Axios.post(ENDPOINT+'user', {
                user_id: username,
                elo: 1000,
            })
            .then (reg_response => {
                if (reg_response.status == 200) {
                    // sign in
                    console.log('user: '+  username + " created");
                    dispatch({
                        type: USER_SIGNED_IN,
                        username,
                        elo: 1000
                    })
                                
                    // get puzzle
                    Axios.get(ENDPOINT+"puzzles/1000")
                    .then(puzzle_res => {
                        console.log(puzzle_res.data);
                        dispatch({
                            type: PUZZLE_LOADED,
                            puzzle: puzzle_res.data
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    
                }
                }
            );
        });

    }
    
 }

 export function hoveredOverCard(card, x, y) {
     return {
         type: HOVERED_OVER_CARD,
         card,
         x,
         y
     }
 }

 export function hoveredAwayFromCard() {
     return {
         type: HOVERED_AWAY_FROM_CARD,
     }
 }

export function cardMovedFromBoardToBench(board, index_on_board) {
    return dispatch => {
        let player_board = Array.from(board.p_board);
        let bench = Array.from(board.p_bench);

        // get the card
        let card = player_board.slice(index_on_board, index_on_board+1)[0];
        // // create new hand with the card removed
        // let new_board = player_board.slice(0, index_on_board).concat(player_board.slice(index_on_board+1, player_board.length))
        // // push card to the bench
        // bench.push(card);

        // // update board
        // board.p_bench = bench;
        // board.p_board = new_board;

        // send request
        Axios.post(ENDPOINT+'action', {
            game: board,
            action: {
                uuid: card.uuid,
                targets: [],
                area: 'p_board',
            },
            action_to_take: "unselect_attacker"
        }).then(board_res => {
            // send to reducer
            dispatch({
                type: BOARD_RECEIVED,
                board: board_res.data
            });
        })
        }
 }

 export function cardMovedFromBenchToBoard(board, index_in_bench) {
    return dispatch => {
            
    // TODO: REMOVE TEST FOR "win game" condition
    //  return {
    //      type: GAME_WON
    //  }
    let bench = Array.from(board.p_bench);

    // // get the card
    let card = bench.slice(index_in_bench, index_in_bench+1)[0];
    // // create new hand with the card removed
    // let new_bench = bench.slice(0, index_in_bench).concat(bench.slice(index_in_bench+1, bench.length))
    // // push card to the bench

    // player_board.push(card);

    // // update board
    // board.p_bench = new_bench;
    // board.p_board = player_board;
    // send request
    Axios.post(ENDPOINT+'action', 
    {
        game: board,
        action: {
            uuid: card.uuid,
            targets: [],
            area: 'p_bench',
        },
        action_to_take: "choose_attacker"
    })
    .then(action_res => {
        console.log(action_res.data);
        let new_board = action_res.data;

        // send to reducer
        dispatch({
            type: BOARD_RECEIVED,
            board: new_board
        });
    } )
    .catch(err => console.error(err))
    }
 }

 export function goButtonPressed(board) {
    return dispatch => {

        // pboard
        let p_board = board.p_board;
        let uuid = "";
        if (p_board) {
            uuid = p_board[0];
        }

        let options = {
            game: board,
            action: {
                uuid,
                targets: [],
                area: 'p_board',
            },
            action_to_take: "attack_phase"
        }
        console.log(options);

        Axios.post(ENDPOINT+'action', {
            ...options
        })
        .then(response => {
            let rec_board = response.data;
            dispatch({
                type: BOARD_RECEIVED,
                board: rec_board,
            })
        })
        .catch(err => {
            console.error(err);
        })
    }
 }

 export function cardMovedFromHandToBench(board, index_in_hand) {
    return dispatch => {
        let current_hand = Array.from(board.hand);

        // get the card
        let card = current_hand.slice(index_in_hand, index_in_hand+1)[0];
        // // create new hand with the card removed
        // let new_hand = current_hand.slice(0, index_in_hand).concat(current_hand.slice(index_in_hand+1, current_hand.length))
        // // push card to the bench
        // bench.push(card);

        // // update board
        // board.p_bench = bench;
        // board.hand = new_hand;
        
        // sent post request (to update mana)
        Axios.post(ENDPOINT+"action", {
            game: board,
            action: {
                uuid: card.uuid,
                targets: [],
                area: 'hand'
            },
            action_to_take: "play_minion"
        })
        .then(cardRes => {
            // send to reducer
            dispatch({
                type: BOARD_RECEIVED,
                board: cardRes.data
            });
        })
        .catch(err => console.error(err))
    }
 }

export function changeUsername(username) {
    return {
        type: CHANGE_USERNAME,
        username,
    }
}

export function reorderHand(game_state, index_old, index_new) {
    let new_hand = Array.from(game_state.hand);
    const [removed] = new_hand.splice(index_old, 1);
    new_hand.splice(index_new, 0, removed);

    game_state.hand = new_hand;

    return {
        type: REORDER_HAND,
        game_state
    }
}

export function changeElo(elo) {
    return {
        type: CHANGE_ELO,
        elo
    }
}