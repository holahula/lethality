const Axios = require('axios');

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

export const GAME_WON = "GAME_WON";

export const ENDPOINT = "http://localhost:4000/";

/*
 * Action creators
 */


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
        console.log("sign in request");
        // get elo and "sign in"
        Axios.post(ENDPOINT+'user/'+username)
        .then(login_res => {
            const username = login_res.data.username;
            const elo = login_res.data.elo;
            
            // get a puzzle
            Axios.get(ENDPOINT+'puzzles/'+elo)
            .then(puzzle_res => {
                // parse puzzle
                const game = puzzle_res.data.game;
                console.log(game);

                // puzzle should be a game state
                // rename hand to cards_in_hand
                game.cards_in_hand = game.hand;

                dispatch({
                    type: USER_SIGNED_IN,
                    username,
                    elo,
                    game
                });

            })

        })

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
    let player_board = Array.from(board.p_board);
    let bench = Array.from(board.p_bench);

    // get the card
    let card = player_board.slice(index_on_board, index_on_board+1)[0];
    // create new hand with the card removed
    let new_board = player_board.slice(0, index_on_board).concat(player_board.slice(index_on_board+1, player_board.length))
    // push card to the bench
    bench.push(card);

    // update board
    board.p_bench = bench;
    board.p_board = new_board;

    // send request


    // send to reducer
    return {
        type: MOVED_TO_BENCH,
        game_state: board
    }
 }

 export function cardMovedFromBenchToBoard(board, index_in_bench) {
     // TODO: REMOVE TEST FOR "win game" condition
     return {
         type: GAME_WON
     }

    let player_board = Array.from(board.p_board);
    let bench = Array.from(board.p_bench);

    // get the card
    let card = bench.slice(index_in_bench, index_in_bench+1)[0];
    // create new hand with the card removed
    let new_bench = bench.slice(0, index_in_bench).concat(bench.slice(index_in_bench+1, bench.length))
    // push card to the bench

    player_board.push(card);

    // update board
    board.p_bench = new_bench;
    board.p_board = player_board;

    // send to reducer
    return {
        type: MOVED_TO_BOARD,
        game_state: board
    }
 }

 export function cardMovedFromHandToBench(board, index_in_hand) {
    let bench = Array.from(board.p_bench);
    let current_hand = Array.from(board.cards_in_hand);

    // get the card
    let card = current_hand.slice(index_in_hand, index_in_hand+1)[0];
    // create new hand with the card removed
    let new_hand = current_hand.slice(0, index_in_hand).concat(current_hand.slice(index_in_hand+1, current_hand.length))
    // push card to the bench
    bench.push(card);

    // update board
    board.p_bench = bench;
    board.cards_in_hand = new_hand;

    // send to reducer
    return {
        type: MOVED_TO_BENCH,
        game_state: board
    }
 }

export function changeUsername(username) {
    return {
        type: CHANGE_USERNAME,
        username,
    }
}

export function reorderHand(game_state, index_old, index_new) {
    let new_hand = Array.from(game_state.cards_in_hand);
    const [removed] = new_hand.splice(index_old, 1);
    new_hand.splice(index_new, 0, removed);

    game_state.cards_in_hand = new_hand;

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