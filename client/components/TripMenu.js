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
import { clearSubmitConfirm } from '../store';
import { createTrip } from '../store/trips';
import { flightsFromAirportByAbbrv } from './util_helper';
import moment from 'moment';
import { ControlPanel, FlightListPanel, UserPanel } from '../components';

const getTripPrice = trip => {
  return trip.length > 0
    ? trip.reduce((a, b) => {
        return a + b.price;
      }, 0)
    : 0;
};

class TripMenu extends Component {
  state = {
    budget: 1000,
    remaining: 0,
    totalPrice: 0,
  };

  // componentWillReceiveProps(nextProps) {
  //   const trip = this.props.trip;
  //   const totalPrice = getTripPrice(trip);
  //   const remaining = Math.max(+this.state.budget - totalPrice, 0);
  //   this.setState({ remaining: remaining }, () => {
  //     this.props.dispatchSetMaxPrice(this.state.remaining);
  //   });
  // }

  handleChangeBudget = e => {
    const trip = this.props.trip;
    const totalPrice = getTripPrice(trip);
    this.setState({ budget: e.target.value }, () => {
      const remaining = Math.max(+this.state.budget - totalPrice, 0);
      this.setState({ remaining: remaining }, () => {
        // this.props.dispatchSetMaxPrice(this.state.remaining);
      });
    });
  };

  handleClearTrip = () => {
    this.props.dispatchClearTrip();
    this.props.dispatchSetTripName('');
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
    const message = `Created ${this.props.currentTripName} successfully`;
    const newTrip = {
      name: this.props.currentTripName,
      userId: this.props.userId,
    };
    console.log('this.props.trip', this.props.trip);
    const flightIds =
      this.props.trip.length > 0
        ? this.props.trip.map(trip => {
            return trip.id;
          })
        : [];
    console.log('flightIds?: ', flightIds);
    if (newTrip.name && newTrip.userId) {
      this.props.dispatchSaveTrip(newTrip, flightIds, message);
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
      tripSubmitConfirm,
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
                  <div className="control">
                    <label className="label is-medium">
                      {currentTripName ? (
                        <span>
                          <strong>Trip: </strong>
                          {currentTripName}
                        </span>
                      ) : (
                        <span className="subtitle">Name your trip:</span>
                      )}
                    </label>
                    <input
                      className="input is-medium"
                      type="text"
                      value={currentTripName}
                      onChange={this.handleTripNameChange}
                    />
                  </div>
                  <div className="control">
                    <label
                      style={{ paddingTop: '1rem' }}
                      className="label is-medium"
                    >
                      <span className="subtitle">Budget</span>
                    </label>
                    <input
                      className="input is-medium"
                      type="text"
                      value={this.state.budget}
                      onChange={this.handleChangeBudget}
                    />
                  </div>
                </div>
              </form>
              <div className="purchase">
                <div className="heading">Total Trip Cost:</div>
                <div className="title">
                  {trip.length > 0 ? ` $${Math.trunc(totalPrice)}` : ''}
                </div>
              </div>
              <div className="purchase">
                <div className="heading">Remaining Budget:</div>
                <div
                  className="title"
                  style={
                    this.state.budget - totalPrice < 0
                      ? { color: 'tomato' }
                      : {}
                  }
                >
                  {this.state.budget > 0
                    ? ` $${Math.trunc(this.state.budget - totalPrice)}`
                    : ''}
                </div>
              </div>
            </div>
            <footer className="card-footer">
              <p className="card-footer-item">
                <a
                  className="button is-success is-outlined"
                  onClick={this.handleSaveTrip}
                  disabled={!currentTripName}
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
                <Link to="/checkout" className="button is-info is-outlined">
                  <span>Checkout</span>
                  <span className="icon is-small">
                    <i className="fa fa-shopping-cart" />
                  </span>
                </Link>
              </p>
            </footer>
          </div>
          {!!tripSubmitConfirm && (
            <div className="card has-text-centered">{tripSubmitConfirm}</div>
          )}
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

const getTripIds = trips => {
  if (!trip) return [];
  return trips.map(trip => {
    return trip.id;
  });
};

const mapState = state => {
  return {
    trip: state.userInput.currentTrip,
    currentFlight: state.userInput.currentFlight,
    currentTripName: state.userInput.currentTripName,
    airportAbbrv: state.userInput.originAirportAbbrv,
    isLoggedIn: !!state.user.id,
    map: state.userInput.map,
    userId: state.user.id,
    maxPrice: state.userInput.maxPrice,
    tripSubmitConfirm: state.userInput.tripSubmitConfirm,
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
    dispatchSetMaxPrice(maxPrice) {
      dispatch(setMaxPrice(maxPrice));
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
    dispatchSaveTrip: (newTrip, flightIds, message) => {
      dispatch(createTrip(newTrip, flightIds, message));
    },
    dispatchClearSubmitConfirm: () => {
      dispatch(clearSubmitConfirm());
    },
  };
};

const ApolloTripMenu = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(TripMenu);

export default withRouter(connect(mapState, mapDispatch)(ApolloTripMenu));
