import {
    CHANGE_USERNAME,
    CHANGE_ELO,
    REORDER_HAND,
    MOVED_TO_BENCH,
    MOVED_TO_BOARD,
    HOVERED_OVER_CARD,
    HOVERED_AWAY_FROM_CARD
} from '../actions/MainActions';
import DataDragon from '../DataDragon';

const cardSchema = (card_id, effect_status) => {
    return {
        card: "",
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

        "p_bench": cardGenerator(2),
        "o_bench": cardGenerator(2),
        "p_board": cardGenerator(3),
        "o_board": cardGenerator(1),
        "cards_in_hand": cardGenerator(3),
        "spell_stack": []
    },
    hover: {
        card: "",
        x: 0,
        y: 0,
        visible: true,
    }
};

console.log(initialState);

function lethalApp(state = initialState, action) {
    switch(action.type) {
        case HOVERED_AWAY_FROM_CARD:
            return Object.assign({}, state, {
                hover: {
                    card: "",
                    x: 0,
                    y: 0,
                    visible: false
                }
            });
        case HOVERED_OVER_CARD:
            return Object.assign({}, state, {
                hover: {
                    card: action.card,
                    x: action.x,
                    y: action.y,
                    visible: true,
                }
            });
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
        case MOVED_TO_BENCH:
                return Object.assign({}, state, {
                    game_state: action.game_state
                })
        case MOVED_TO_BOARD:
                return Object.assign({}, state, {
                    game_state: action.game_state
                })
        default:
            return state;
    }
}

export default lethalApp;