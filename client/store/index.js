import {createStore, combineReducers, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import user from './user';
import airports from './airports';
import flightPrices from './flight-prices';

const reducer = combineReducers({
  user,
  airports,
  flightPrices,
});
const middleware = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}));
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './airports';
export * from './flight-prices';
