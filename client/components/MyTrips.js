/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setTrip } from '../store';
import { graphql } from 'react-apollo';
import { tripsByUserId } from './util_helper';

class MyTrips extends Component {
  handleSetTrip = (tripId, e) => {
    const { allTrips } = this.props;
    // const tripId = e.target.dataset.tripid;
    // const tripId = e.target.value;
    // console.log('alltrips:', allTrips);
    console.log('tripId:', tripId);
    const formattedTrip = loadTripData(allTrips.trips, +tripId);
    console.log('formattedTrip:', formattedTrip);
    this.props.dispatchSetTrip(formattedTrip);
  };
  render() {
    const {
      // myTrips,
      currentTripName,
      allTrips,
      loading,
    } = this.props;

    const myTrips = !loading
      ? allTrips.trips.map(trip => {
          return {
            id: trip.id,
            name: trip.name,
          };
        })
      : '';
    // const foundTrip =
    //   allTrips && allTrips.trips.length > 0
    //     ? loadTripData(allTrips.trips, 5)
    //     : [];
    // console.log('formatted trip array:', foundTrip);
    return (
      <div>
        <nav className="panel flight-list">
          {myTrips &&
            myTrips.map(trip => {
              const active = trip.name === currentTripName;
              return (
                <a
                  onClick={this.handleSetTrip.bind(null, trip.id)}
                  className={`panel-block
                ${active ? 'is-active' : ''} list-item`}
                  key={trip.id}
                  // data-tripid={trip.id}
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

const loadTripData = (trips, tripId) => {
  console.log('loadTripData(): trips, tripId:', trips, tripId);
  const foundTrip = trips.find(tripObj => {
    return tripObj.id === tripId;
  });
  console.log('loadTripData(): foundTrip:', foundTrip);
  return foundTrip.tripFlightsByTripId.nodes.map(flight => {
    return {
      ...flight.flightByFlightId,
    };
  });
};

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
    dispatchSetTrip(trip) {
      dispatch(setTrip(trip));
    },
  };
};

const ApolloMyTrips = graphql(tripsByUserId, {
  options: ({ userId }) => ({ variables: { id: userId } }),
  props: ({ data: { loading, allTrips } }) => ({ loading, allTrips }),
})(MyTrips);

export default withRouter(connect(mapState, mapDispatch)(ApolloMyTrips));
