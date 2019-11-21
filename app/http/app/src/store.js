import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import lethalApp from './reducers/MainReducer';
const store = createStore(lethalApp, applyMiddleware(thunk));

export default store;