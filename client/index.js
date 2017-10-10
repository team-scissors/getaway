import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import store, { client } from './store';
import App from './app';
import { StripeProvider } from 'react-stripe-elements';

// const Stripe = () => {
//   return (
//     <StripeProvider apiKey="pk_test_12345">
//       <MyStoreCheckout />
//     </StripeProvider>
//   );
// };

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
);
