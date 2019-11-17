import { CHANGE_USERNAME, CHANGE_ELO } from '../actions/MainActions';

const initialState = {
    username: "alxander64",
    elo: 420,
};

function lethalApp(state = initialState, action) {
    switch(action.type) {
        case CHANGE_USERNAME:
            return Object.assign({}, state, {
                username: "mogen"
            });
        case CHANGE_ELO:
            return Object.assign({}, state, {
                elo: action.payload.elo
            });
        default:
            return state;
    }
}

export default lethalApp;