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
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">Current Flight</p>
            </header>
            <div className="card-content">
              <div className="content">
                {!loading && (
                  <span>
                    <strong>{origin.abbrv}</strong>, {origin.city}{' '}
                  </span>
                )}
                {currentFlight.dest && (
                  <span>
                    <i
                      className="fa fa-chevron-right"
                      aria-hidden="true"
                    />{' '}
                    <strong>{currentFlight.dest.abbrv}</strong>,{' '}
                    {currentFlight.dest.city}{' '}
                  </span>
                )}
                <p>
                  {currentFlight.dest && (
                    <span>
                      on <strong>{currentFlight.departAt}</strong> @{' '}
                      <strong>${Math.trunc(currentFlight.price)} </strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <footer className="card-footer">
              <a href="#" className="card-footer-item">
                Add To Trip
              </a>
            </footer>
          </div>
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
    dispatchAddFlightToTrip(flight) {
      dispatch(addFlightToTrip(flight));
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
