
/*
 * Action types
*/
export const CHANGE_USERNAME = "CHANGE_USERNAME";
export const CHANGE_ELO = "CHANGE_ELO";
export const REORDER_HAND = "REORDER_HAND";
export const MOVED_TO_BENCH = "MOVED_TO_BENCH";
export const MOVED_TO_BOARD = "MOVED_TO_BOARD";

/*
 * Action creators
 */

 export function cardMovedFromBenchToBoard(board, index_in_bench) {
     
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

    console.log(game_state.cards_in_hand);

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