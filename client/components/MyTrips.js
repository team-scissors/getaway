/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { trips, fetchTrips } from '../store';
import { setTripName, setTrip } from '../store/user-input';
import * as _ from 'underscore';

class MyTrips extends Component {
  componentDidMount() {
    const { userId, dispatchFetchTrips } = this.props;
    if (userId) dispatchFetchTrips(userId);
  }

  handleLoadTrip = evt => {
    const selectedTrip = this.props.myTrips.find(trip => {
      return trip.id === +evt.target.dataset.tripid;
    });
    this.props.dispatchSetTrip(selectedTrip.Flights);
    this.props.dispatchSetTripName(selectedTrip.name);
  };

  render() {
    const { myTrips, currentTripName } = this.props;
    const tripsList =
      myTrips &&
      myTrips.map(trip => {
        return <li key={trip.id}>{trip.name}</li>;
      });
    return (
      <div>
        <nav className="panel flight-list">
          {myTrips &&
            myTrips.map(trip => {
              const active = trip.name === currentTripName;
              return (
                <a
                  onClick={this.handleLoadTrip}
                  className={`panel-block
                ${active ? 'is-active' : ''} list-item`}
                  key={trip.id}
                  data-tripid={trip.id}
                  style={active ? { background: '#00d1b2', color: '#fff' } : {}}
                >
                  <div>
                    <strong>{`${trip.name}`}</strong>
                  </div>
                </a>
              );
            })}
        </nav>
      </div>
    );
  }
}

const mapState = state => {
  return {
    myTrips: state.trips,
    isLoggedIn: !!state.user.id,
    userId: state.user.id,
    currentTripName: state.userInput.currentTripName,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchFetchTrips: userId => {
      dispatch(fetchTrips(userId));
    },
    dispatchSetTrip: trip => {
      dispatch(setTrip(trip));
    },
    dispatchSetTripName: tripName => {
      dispatch(setTripName(tripName));
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(MyTrips));
