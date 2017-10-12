/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setTrip, setTripName, deleteTrip } from '../store';
import { graphql } from 'react-apollo';
import { tripsByUserId } from './util_helper';

class MyTrips extends Component {
  handleSetTrip = (tripId, e) => {
    const { allTrips } = this.props;
    const [formattedTrip, tripName] = loadTripData(allTrips.trips, +tripId);
    this.props.dispatchSetTrip(formattedTrip);
    this.props.dispatchSetTripName(tripName);
  };
  handleDeleteTrip = (tripId, e) => {
    console.log('tripId', tripId);
    console.log('e', e);
    const { dispatchDeleteTrip, userId, loading, refetch } = this.props;
    dispatchDeleteTrip(tripId, userId);
    if (!loading) refetch();
  };
  render() {
    const { currentTripName, allTrips, loading } = this.props;
    console.log();

    const myTrips = !loading
      ? allTrips.trips.map(trip => {
          const price = trip.tripFlightsByTripId.nodes.reduce((acc, node) => {
            return acc + node.flightByFlightId.price;
          }, 0);
          return {
            id: trip.id,
            name: trip.name,
            price: Math.trunc(price),
          };
        })
      : '';
    return (
      <div>
        <nav className="panel flight-list">
          {myTrips &&
            myTrips.map(trip => {
              const active = trip.name === currentTripName;
              return (
                <a
                  onClick={this.handleSetTrip.bind(null, trip.id)}
                  className={`panel-block trip-row
                ${active ? 'is-active' : ''} list-item`}
                  key={trip.id}
                  style={active ? { background: '#eee', color: '#000' } : {}}
                >
                  <div style={{ width: '33%', textAlign: 'left' }}>
                    {<strong>{`${trip.name}`}</strong>}
                  </div>
                  <div
                    style={{
                      width: '33%',
                      textAlign: 'right',
                      paddingRight: '20px',
                    }}
                  >
                    ${trip.price}
                  </div>
                  <div style={{ width: '33%', textAlign: 'right' }}>
                    <button
                      onClick={this.handleDeleteTrip.bind(null, trip.id)}
                      className="button is-danger is-outlined"
                    >
                      Delete Trip
                    </button>
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
  const foundTrip = trips.find(tripObj => {
    return tripObj.id === tripId;
  });
  return [
    foundTrip.tripFlightsByTripId.nodes.map(flight => {
      return {
        ...flight.flightByFlightId,
      };
    }),
    foundTrip.name,
  ];
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
    dispatchSetTripName(tripName) {
      dispatch(setTripName(tripName));
    },
    dispatchDeleteTrip(tripId, userId) {
      dispatch(deleteTrip(tripId, userId));
    },
  };
};

const ApolloMyTrips = graphql(tripsByUserId, {
  options: ({ userId }) => ({ variables: { id: userId } }),
  props: ({ data: { loading, allTrips, refetch } }) => ({
    loading,
    allTrips,
    refetch,
  }),
})(MyTrips);

export default withRouter(connect(mapState, mapDispatch)(ApolloMyTrips));
