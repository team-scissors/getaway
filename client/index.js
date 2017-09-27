import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import store from './store';
import Routes from './routes';
import { red, blueGrey, amber } from 'material-ui/colors';
import { primaryWhite, primaryWhite2 } from './components/Colors';

// establishes socket connection
// import './socket'
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: primaryWhite2,
    secondary: primaryWhite,
    error: red,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app'),
);
