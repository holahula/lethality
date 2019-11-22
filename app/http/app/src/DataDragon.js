import dd from './data_dragon_raw.js';
import uuidv4 from 'uuid/v4';

class DataDragon {
    
    randomCard() {
        let index = Math.round(Math.random()* dd.length);
        let card = dd[index];
        card['uuid'] = uuidv4();
        return card;
    }

}

let instance = new DataDragon();

export default instance;