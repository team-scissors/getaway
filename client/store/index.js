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
import airports from './airports';

// At this time, the GraphQL URI route is hard-coded. This won't work in production.
// TODO: Instead of hard-coding it, find the production URI and set the client to that.
const networkInterface = createNetworkInterface({ uri: 'http://localhost:8080/graphql' });
export const client = new ApolloClient({
  networkInterface,
});

const reducer = combineReducers({
  user,
  airports,
  apollo: client.reducer(),
});
const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
  // (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './airports';
