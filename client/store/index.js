import {
  createStore,
  combineReducers,
  applyMiddleware,
  // compose,
} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import user from './user';
import userInput from './user-input';
import trips from './trips';
import error from './error';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
});
export const client = new ApolloClient({
  networkInterface,
});

const reducer = combineReducers({
  user,
  userInput,
  trips,
  error,
  apollo: client.reducer(),
});
const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true })
  // (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './user-input';
export * from './trips';
export * from './error';
