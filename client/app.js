import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import history from './history';
import { flightsFromAirportByAbbrv } from './components/util_helper';
import {
  Main,
  Flights,
  SideMenu,
  TopNavFlight,
  Map,
  Login,
  Signup,
  D3Test,
  UserHome,
  TripMenu,
} from './components';
import { me } from './store';

/**
 * COMPONENT
 */
class App extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <Router history={history}>
        <div className="columns main-container">
          <SideMenu />
          <div className="column main-content">
            <div>
              <TopNavFlight />
            </div>
            <div
              style={{
                height: '100%',
                position: 'inherit',
              }}
            >
              <Switch>
                {/* Routes placed here are available to all visitors */}
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/flights" />}
                />
                <Route path="/map" component={Map} />
                <Route path="/flights" component={Flights} />
                {isLoggedIn ? (
                  <Switch>
                    {/* Routes placed here are only available after logging in */}
                    <Route path="/home" component={UserHome} />
                  </Switch>
                ) : (
                  <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                  </Switch>
                )}
              </Switch>
            </div>
          </div>
          <TripMenu />
        </div>
      </Router>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    airportAbbrv: state.userInput.originAirportAbbrv,
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

const ApolloApp = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(App);

export default connect(mapState, mapDispatch)(ApolloApp);

/**
 * PROP TYPES
 */
App.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
