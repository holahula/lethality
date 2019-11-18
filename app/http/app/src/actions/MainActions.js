
/*
 * Action types
*/
export const CHANGE_USERNAME = "CHANGE_USERNAME";
export const CHANGE_ELO = "CHANGE_ELO";

export const REORDER_HAND = "REORDER_HAND";

/*
 * Action creators
 */

export function changeUsername(username) {
    return {
        type: CHANGE_USERNAME,
        username,
    }
}

export function reorderHand(game_state, hand, index_old, index_new) {
    let new_hand = Array.from(hand);
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