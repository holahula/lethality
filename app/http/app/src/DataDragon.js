import dd from './data_dragon_raw.js';
import uuidv4 from 'uuid/v4';

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

let instance = new DataDragon();

export default instance;