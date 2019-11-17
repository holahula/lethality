import { createStore } from 'redux';
import lethalApp from './reducers/MainReducer';
const store = createStore(lethalApp);

export default store;