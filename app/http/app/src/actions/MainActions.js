/*
 * Action types
*/
const CHANGE_USERNAME = "CHANGE_USERNAME";
const CHANGE_ELO = "CHANGE_ELO";

/*
 * Action creators
 */

function changeUsername(username) {
    return {
        type: CHANGE_USERNAME,
        username,
    }
}

function changeElo(elo) {
    return {
        type: CHANGE_ELO,
        elo
    }
}