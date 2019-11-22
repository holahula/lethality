import {
    CHANGE_USERNAME,
    CHANGE_ELO,
    REORDER_HAND,
    MOVED_TO_BENCH,
    MOVED_TO_BOARD,
    HOVERED_OVER_CARD,
    HOVERED_AWAY_FROM_CARD,
    USER_SIGNED_IN,
    USERNAME_FIELD_CHANGED,
    USER_SIGNED_OUT,
    GAME_WON
} from '../actions/MainActions';
import DataDragon from '../DataDragon';

const cardSchema = (card_id, effect_status) => {

    return {
        "associatedCards": [],
        "associatedCardRefs": [],
        "assets": [
          {
            "gameAbsolutePath": "http://dd.b.pvp.net/Set1/en_us/img/cards/01NX002.png",
            "fullAbsolutePath": "http://dd.b.pvp.net/Set1/en_us/img/cards/01NX002-full.png"
          }
        ],
        "region": "Noxus",
        "regionRef": "Noxus",
        "attack": 0,
        "attack_delta": 0,
        "cost": 5,
        "cost_delta": 0,
        "health": 0,
        "health_delta": 0,
        "description": "Deal 4 to the enemy Nexus.",
        "descriptionRaw": "Deal 4 to the enemy Nexus.",
        "levelupDescription": "",
        "levelupDescriptionRaw": "",
        "flavorText": "\"Sometimes, it takes tactical genius to break a fortress. Sometimes, you just have to hit it harder.\" - Darius",
        "artistName": "Max Grecke",
        "name": "Decimate",
        "cardCode": "01NX002",
        "uuid": "blah",
        "keywords": [
          "Slow"
        ],
        "keywordRefs": [
          "Slow"
        ],
        "spellSpeed": "Slow",
        "spellSpeedRef": "Slow",
        "rarity": "Rare",
        "rarityRef": "Rare",
        "subtype": "",
        "supertype": "",
        "type": "Spell",
        "collectible": true
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
    library_cards: ['01IO048T1', '01DE022', '01PZ018', '01FR009', '01NX038', '01IO040', '01DE020', '01PZ040', '01DE045', '01PZ032', '01SI027T1', '01NX038T2', '01IO005', '01FR028', '01SI002', '01PZ020', '01SI037', '01IO028T2', '01IO028T1', '01SI048T1', '01PZ015', '01SI052', '01DE049', '01IO013', '01SI024', '01FR026', '01PZ059', '01NX012', '01SI007T1', '01DE046', '01DE030', '01DE011', '01FR054', '01FR049T1', '01PZ014T1', '01NX041', '01FR039T2', '01DE016', '01NX015', '01IO009T1', '01PZ033T1', '01FR039', '01FR027', '01NX042', '01IO048', '01NX045', '01NX031', '01FR053', '01IO052T1', '01SI039', '01IO030', '01PZ009', '01NX034', '01DE042', '01NX026', '01SI004', '01DE039', '01DE029', '01FR024T4', '01DE028', '01DE012', '01SI055'],
    
    showWinScreen: false,
    isSignedIn: false,
    username: "",
    elo: 1000,
    game_state: {
        "p_health": 20,
        "o_health": 20,
        "p_mana": 1,
        "o_mana": 1,
        "p_spell_mana": 2,
        "o_spell_mana": 2,
        "attack_token": true,

        "action_button_text": "GO",

        "o_bench": cardGenerator(2),
        "o_board": cardGenerator(0),
        "p_board": cardGenerator(0),
        "p_bench": cardGenerator(0),
        "cards_in_hand": cardGenerator(10),
        "spell_stack": [{
            card_id: '01NX013',
            uuid: '123',
            effect_status: [],
        },{
            card_id: '01NX013',
            uuid: '123',
            effect_status: [],
        },{
            card_id: '01NX013',
            uuid: '123',
            effect_status: [],
        }]
    },

    custom_game_board: {
        "p_health": 20,
        "o_health": 20,
        "p_mana": 1,
        "o_mana": 1,
        "p_spell_mana": 2,
        "o_spell_mana": 2,
        "attack_token": true,

        "action_button_text": "GO",

        "o_bench": cardGenerator(2),
        "o_board": cardGenerator(0),
        "p_board": cardGenerator(0),
        "p_bench": cardGenerator(0),
        "cards_in_hand": cardGenerator(10),
        "spell_stack": cardGenerator(10)
    },

    hover: {
        card: "",
        x: 0,
        y: 0,
        visible: false,
    }
};


function lethalApp(state = initialState, action) {
    switch(action.type) {
        case GAME_WON:
            return Object.assign({}, state, {
                showWinScreen: true,
            });
        case USER_SIGNED_OUT:
            return Object.assign({}, state, {
                ...initialState
            });
        case USERNAME_FIELD_CHANGED:
            return Object.assign({}, state, {
                username: action.username,
            });
        case USER_SIGNED_IN:
            return Object.assign({}, state, {
                username: action.username,
                elo: action.elo,
                isSignedIn: true,
                game_state: action.game,
                showWinScreen: false,
            });
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