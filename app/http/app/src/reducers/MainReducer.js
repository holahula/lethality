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
    GAME_WON,
    CREATE_BUTTON_PRESSED,
    PUZZLE_LOADED,
    BOARD_RECEIVED
} from '../actions/MainActions';
import DataDragon from '../DataDragon';
import { CARD_ADDED, FIELD_UPDATED, PUZZLE_CREATED } from '../actions/CreateActions';


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
        "puzzle_id": 5,
        "p_health": 20,
        "o_health": 20,
        "p_mana": 1,
        "o_mana": 1,
        "p_spell_mana": 2,
        "o_spell_mana": 2,
        "attack_token": true,

        "action_button_text": "GO",

        "o_bench": cardGenerator(2),
        "o_board": cardGenerator(4),
        "p_board": cardGenerator(0),
        "p_bench": cardGenerator(0),
        "hand": cardGenerator(10),
        "spell_stack": [],
    },

    custom_game_board: {
        show_popup: false,

        "puzzle_id": 5,
        "p_health": 20,
        "o_health": 20,
        "p_mana": 1,
        "o_mana": 1,
        "p_spell_mana": 2,
        "o_spell_mana": 2,
        "attack_token": true,

        "action_button_text": "GO",

        "o_bench": cardGenerator(0),
        "o_board": cardGenerator(0),
        "p_board": cardGenerator(0),
        "p_bench": cardGenerator(0),
        "hand": cardGenerator(0),
        "spell_stack": [],
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
        case BOARD_RECEIVED:
            return Object.assign({}, state, {
                game_state: action.board
            });
        case PUZZLE_LOADED:
            return Object.assign({}, state, {
                game_state: action.puzzle
            });
        case PUZZLE_CREATED:
            return Object.assign({}, state, {
                custom_game_board: {
                    ...state.custom_game_board,
                    show_popup: false,
                },
                game_state: action.puzzle
            });
        case CREATE_BUTTON_PRESSED:
            return Object.assign({}, state, {
                custom_game_board: {
                    ...state.custom_game_board,
                    show_popup: true
                }
            });
        case FIELD_UPDATED:
            switch(action.destination) {
                case "o_health":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            o_health: action.text
                        }
                    });
                case "o_mana":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            o_mana: action.text
                        }
                    });
                case "p_health":
                return Object.assign({}, state, {
                    custom_game_board: {
                        ...state.custom_game_board,
                        p_health: action.text
                    }
                });
                case "p_mana":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            p_mana: action.text
                        }
                    });
                }
        case CARD_ADDED:
            switch(action.destination) {
                case "player_bench":
                        return Object.assign({}, state, {
                            custom_game_board: {
                                ...state.custom_game_board,
                                p_bench: action.new_bench
                            }
                        });
                case "opponent_bench":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            o_bench: action.new_bench
                        }
                    });
                case "opponent_board":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            o_board: action.new_board
                        }
                    });
                case "player_board":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            p_board: action.new_board
                        }
                    });
                case "player_hand":
                    return Object.assign({}, state, {
                        custom_game_board: {
                            ...state.custom_game_board,
                            hand: action.new_hand
                        }
                    });
                default:
                    break;
            }
            
            break;
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