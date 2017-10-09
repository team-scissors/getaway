import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import { ControlPanel, FlightListPanel } from '../components';
import { graphql } from 'react-apollo';
import * as _ from 'underscore';
import { flightsFromAirportByAbbrv } from './util_helper';
import {
  setAirport,
  clearTrip,
  setMaxPrice,
  addFlightToTrip,
  setDate,
} from '../store/user-input';

class TopNavFlight extends Component {
  handleAddFlightToTrip = () => {
    if (this.props.currentFlight.dest) {
      const flight = {
        ...this.props.currentFlight,
        origin: _.omit(this.props.origin, 'flights'),
      };
      this.props.dispatchSetAirport(flight.dest.abbrv);
      this.props.dispatchAddFlightToTrip(flight);
    }
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

    return (
      <nav className="navbar is-white top-nav">
        <div className="navbar-item">
          {!loading && origin ? (
            <span>
              From:{' '}
              <strong>
                {origin.abbrv}, {origin.city}
              </strong>
            </span>
          ) : (
            <span className="icon is-huge">
              <i className="fa fa-refresh fa-spin" />
            </span>
          )}
        </div>
        {currentFlight.dest && (
          <div className="navbar-item">
            <span>
              To:{' '}
              <strong>
                {currentFlight.dest.abbrv}, {currentFlight.dest.city}
              </strong>
            </span>
          </div>
        )}
        {currentFlight.dest && (
          <div className="navbar-item">
            <span>
              on <strong>{currentFlight.departAt}</strong> @{' '}
              <strong>${Math.trunc(currentFlight.price)}</strong>
            </span>
          </div>
        )}
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a
                  className="button is-success is-outlined"
                  onClick={this.handleAddFlightToTrip}
                >
                  <span className="icon is-small">
                    <i className="fa fa-chevron-right" />
                  </span>
                  <span>Add To Trip</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </nav>
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
    dispatchSetAirport(abbrv) {
      dispatch(setAirport(abbrv));
    },
  };
};

const ApolloTopNavFlight = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(TopNavFlight);

export default withRouter(connect(mapState, mapDispatch)(ApolloTopNavFlight));
