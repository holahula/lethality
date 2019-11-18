import {
    CHANGE_USERNAME,
    CHANGE_ELO,
    REORDER_HAND
} from '../actions/MainActions';
import DataDragon from '../DataDragon';

const cardSchema =(card_id, effect_status) => {
    return {
        card_id: "",
        uuid: "",
        effect_status: [],
    }
}

function cardGenerator(number) {
    let cards = [];
    for (let i=0; i<number; i++){
        const card = DataDragon.randomCard();
        cards.push(card);
    }
    return cards;
}

const initialState = {
    username: "alxander64",
    elo: 420,
    game_state: {
        "p_health": 20,
        "o_health": 20,
        "p_mana": 3,
        "o_mana": 0,
        "p_spell_mana": 0,
        "o_spell_mana": 0,
        "attack_token": true,

        "action_button_text": "GO",

        "p_bench": cardGenerator(6),
        "o_bench": cardGenerator(6),
        "p_board": cardGenerator(3),
        "o_board": cardGenerator(6),
        "cards_in_hand": cardGenerator(10),
        "spell_stack": []
    }
};

console.log(initialState);

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
        case REORDER_HAND:
            return Object.assign({}, state, {
                game_state: action.game_state
            })
        default:
            return state;
    }
}

export default lethalApp;