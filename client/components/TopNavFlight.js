import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import { ControlPanel, FlightListPanel } from '../components';
import { graphql } from 'react-apollo';
import * as _ from 'underscore';
import { flightsFromAirportByAbbrv } from './util_helper';
import {
  setCurrentFlight,
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

  handleLuckyAdd = () => {
    // pick a random dest
    const flights = this.props.origin.flights.nodes;
    const randomDest = flights[Math.floor(Math.random() * flights.length)];
    console.log('random dest:', randomDest);
    this.props.dispatchSetCurrentFlight(randomDest);
    // handleAddFlightToTrip();
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
      <nav className="level" style={{ padding: 18 }}>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">From</p>
            <p className="title is-6">
              {!loading && origin ? (
                <span>
                  {origin.abbrv}, {origin.city}
                </span>
              ) : (
                <span className="icon is-huge">
                  <i className="fa fa-refresh fa-spin" />
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">To</p>
            <p className="title is-6">
              {currentFlight.dest ? (
                <span>
                  {currentFlight.dest.abbrv}, {currentFlight.dest.city}
                </span>
              ) : (
                <span />
              )}
            </p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Departure</p>
            <p className="title is-6">
              {currentFlight && <span>{currentFlight.departAt}</span>}
            </p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Price</p>
            <p className="title is-6">
              {currentFlight.dest && (
                <span>${Math.trunc(currentFlight.price)}</span>
              )}
            </p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div className="field is-grouped">
            <p className="control">
              <a className="button is-primary " onClick={this.handleLuckyAdd}>
                <span>¯\_(ツ)_/¯</span>
              </a>
            </p>
          </div>
        </div>
        <div className="field is-grouped">
          <p className="control">
            <a className="button is-info " onClick={this.handleAddFlightToTrip}>
              <span className="icon is-small">
                <i className="fa fa-chevron-right" />
              </span>
              <span>Add To Trip</span>
            </a>
          </p>
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
    dispatchSetCurrentFlight(selectedAirport) {
      dispatch(setCurrentFlight(selectedAirport));
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
