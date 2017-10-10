import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { logout } from '../store';
import * as _ from 'underscore';
import {
  setAirport,
  clearTrip,
  setMaxPrice,
  addFlightToTrip,
  setDate,
  setTripName,
} from '../store/user-input';
import { createTrip } from '../store/trips';
import { flightsFromAirportByAbbrv } from './util_helper';
import moment from 'moment';
import { ControlPanel, FlightListPanel, UserPanel } from '../components';

class TripMenu extends Component {
  handleClearTrip = () => {
    this.props.dispatchClearTrip();
  };

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

  handleSaveTrip = evt => {
    evt.preventDefault();
    const userId = this.props.userId;
    const currentTripName = this.props.currentTripName;
    if (userId && currentTripName) {
      this.props.dispatchSaveTrip(userId, currentTripName);
    } else {
      // Something is wrong. TODO
    }
  };

  handleTripNameChange = evt => {
    const name = evt.target.value;
    this.props.dispatchSetTripName(name);
  };

  handleFlyTo = airport => {
    const { map } = this.props;
    console.log('want to fly to: ', airport);
    map.flyTo({
      center: [airport.longitude, airport.latitude],
    });
  };

  render() {
    const {
      children,
      origin,
      currentFlight,
      currentTripName,
      handleClick,
      isLoggedIn,
      match,
      loading,
      trip,
    } = this.props;

    const totalPrice =
      trip.length > 0
        ? trip.reduce((a, b) => {
          return a + b.price;
        }, 0)
        : 0;

    return (
      <div className="column is-narrow trip-menu">
        <aside className="menu menu-wrapper">
          <UserPanel />
          <div className="card">
            <div className="card-content">
              <form onSubmit={this.handleSaveTrip}>
                <div className="field">
                  {/* <label className="label is-medium">Trip</label> */}
                  <div className="control">
                    <input
                      className="input is-medium"
                      type="text"
                      placeholder="Trip Name"
                      value={currentTripName}
                      onChange={this.handleTripNameChange}
                    />
                  </div>
                </div>
              </form>
              <div className="section">
                Total Trip Cost:
                {trip.length > 0 ? `$${Math.trunc(totalPrice)}` : ''}
              </div>
            </div>
            <footer className="card-footer">
              <p className="card-footer-item">
                <a
                  className="button is-success is-outlined"
                  onClick={this.handleSaveTrip}
                >
                  <span>Save</span>
                  <span className="icon is-small">
                    <i className="fa fa-check" />
                  </span>
                </a>
              </p>
              <p className="card-footer-item">
                <a
                  onClick={this.handleClearTrip}
                  className="button is-danger is-outlined"
                >
                  <span>Clear</span>
                  <span className="icon is-small">
                    <i className="fa fa-times" />
                  </span>
                </a>
              </p>
              <p className="card-footer-item">
                <Link
                  to="/checkout"
                  className="button is-info is-outlined"
                >
                  <span>Checkout</span>
                  <span className="icon is-small">
                    <i className="fa fa-shopping-cart" />
                  </span>
                </Link>
              </p>
            </footer>
          </div>
          {trip.length > 0 ? (
            <div className="card trip-list">
              <nav className="panel">
                {' '}
                {trip.map((flight, idx) => {
                  return (
                    <a className="panel-block" key={idx}>
                      <nav className="level flight-list-item">
                        <div className="level-item has-text-centered">
                          <div onClick={() => this.handleFlyTo(flight.origin)}>
                            <p className="heading">From</p>
                            <p className="title is-6">{flight.origin.abbrv}</p>
                          </div>
                        </div>
                        <div className="level-item has-text-centered">
                          <div onClick={() => this.handleFlyTo(flight.dest)}>
                            <p className="heading">To</p>
                            <p className="title is-6">{flight.dest.abbrv}</p>
                          </div>
                        </div>
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Date</p>
                            <p className="title is-6">{flight.departAt}</p>
                          </div>
                        </div>
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Price</p>
                            <p className="title is-6">
                              ${Math.trunc(flight.price)}
                            </p>
                          </div>
                        </div>
                      </nav>
                    </a>
                  );
                })}
              </nav>
            </div>
          ) : (
              ''
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
    currentTripName: state.userInput.currentTripName,
    airportAbbrv: state.userInput.originAirportAbbrv,
    isLoggedIn: !!state.user.id,
    map: state.userInput.map,
    userId: state.user.id,
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
    dispatchSetAirport(abbrv) {
      dispatch(setAirport(abbrv));
    },
    dispatchSetTripName(name) {
      dispatch(setTripName(name));
    },
    dispatchSaveTrip: (userId, name) => {
      dispatch(createTrip({ userId, name }));
    },
  };
};

const ApolloTripMenu = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(TripMenu);

export default withRouter(connect(mapState, mapDispatch)(ApolloTripMenu));
