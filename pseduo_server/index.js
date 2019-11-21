const express = require('express')
const cors = require('cors');
const app = express()
const port = 4000
const dd =  require('./data_dragon_raw.js');
const uuidv4 = require('uuid/v4');

class DataDragon {
    
    randomCard() {
        let index = Math.round(Math.random()* dd.length);

        let card = dd[index];
        
        return {
            card_id: card.cardCode,
            uuid: uuidv4(),
            effect_status: [],
            hp: 4,
        }
    }

}

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/user/:username', (req, res) => {
    res.status(200).send({
        username: req.params.username,
        elo: 1001,
    });
});

app.get('/puzzles/:elo', (req, res) => {
    console.log('accepted request for puzzle');
    game_state = {
        "p_health": 20,
        "o_health": 20,
        "p_mana": 1,
        "o_mana": 1,
        "p_spell_mana": 2,
        "o_spell_mana": 2,
        "attack_token": true,

        "action_button_text": "GO",

        "o_bench": cardGenerator(2),
        "o_board": cardGenerator(3),
        "p_board": cardGenerator(0),
        "p_bench": cardGenerator(3),
        "hand": cardGenerator(8),
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
    }

    res.status(200).send({
        game: game_state,
    });

});

const cardSchema = (card_id, effect_status) => {
    return {
        card: "",
        uuid: "",
        effect_status: [],
        hp: 4,
    }
}

function cardGenerator(number) {
    let d = new DataDragon();
    let cards = [];
    for (let i=0; i<number; i++){
        const card = d.randomCard();
        cards.push(card);
    }
    return cards;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
