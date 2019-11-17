
/*
 * Action types
*/
export const CHANGE_USERNAME = "CHANGE_USERNAME";
export const CHANGE_ELO = "CHANGE_ELO";

/*
 * Action creators
 */

export function changeUsername(username) {
    return {
        type: CHANGE_USERNAME,
        username,
    }
}

export function changeElo(elo) {
    return {
        type: CHANGE_ELO,
        elo
    }
}