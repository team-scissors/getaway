import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { logout } from '../store';
import {
  setAirport,
  clearTrip,
  setMaxPrice,
  addFlightToTrip,
  setDate,
} from '../store/user-input';
import { flightsFromAirportByAbbrv } from './util_helper';
import moment from 'moment';
import { ControlPanel, FlightListPanel } from '../components';

class TripMenu extends Component {
  handleClearTrip = () => {
    this.props.dispatchClearTrip();
  };

  render() {
    const {
      children,
      origin,
      currentFlight,
      handleClick,
      isLoggedIn,
      match,
      loading,
      trip,
    } = this.props;

    console.log('trip', trip);
    console.log('currentFlight', currentFlight);
    console.log('origin', origin);

    console.log('loading', loading, 'origin', origin);

    return (
      <div className="column is-narrow trip-menu">
        <aside className="menu menu-wrapper">
          <div className="box">{!loading && `From ${origin.abbrv}`}</div>
          <div className="sidenav-top-container">
            <ul>
              {trip.length > 0 &&
                trip.map((flight, idx) => {
                  return (
                    <li key={idx}>
                      {flight.origin.name} to {flight.dest.name}
                    </li>
                  );
                })}
            </ul>
          </div>
          {trip.length > 0 && (
            <a className="button is-info" onClick={this.handleClearTrip}>
              Clear Trip
            </a>
          )}
        </aside>
      </div>
    );
  }
}

const mapState = state => {
  return {
    trip: state.userInput.currentTrip,
    currentFlight: state.userInput.currentFlight,
    airportAbbrv: state.userInput.originAirportAbbrv,
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
    dispatchClearTrip() {
      dispatch(clearTrip());
    },
  };
};

const ApolloTripMenu = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(TripMenu);

export default withRouter(connect(mapState, mapDispatch)(ApolloTripMenu));
