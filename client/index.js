import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
// REVIEW: be bold, delete this code
// import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import store, { client } from './store';
import App from './app';

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
);
