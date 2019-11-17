import { CHANGE_USERNAME, CHANGE_ELO } from '../actions/MainActions';

const initialState = {
    username: "alxander64",
    elo: 420,
    game_state: {
        "p_health": 20,
        "o_health": 20,
        "p_mana": 0,
        "o_mana": 0,
        "p_spell_mana": 0,
        "o_spell_mana": 0,
        "attack_token": true,

        "action_button_text": "GO",

        "p_bench": ["card"],
        "o_bench": ["card"],
        "p_board": ["card"],
        "o_board": ["card"],
        "cards_in_hand": ["card"],
        "spell_stack": []
    }
};

function lethalApp(state = initialState, action) {
    switch(action.type) {
        case CHANGE_USERNAME:
            return Object.assign({}, state, {
                username: action.username
            });
        case CHANGE_ELO:
            return Object.assign({}, state, {
                elo: action.elo
            });
        default:
            return state;
    }
}

export default lethalApp;