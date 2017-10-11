/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setTrip,
  setTripName,
  deleteTrip,
} from '../store';
import { graphql } from 'react-apollo';
import { tripsByUserId } from './util_helper';

class MyTrips extends Component {

  componentWillRecievePRops(nextProps) {
    console.log('newProps', newProps);
  }

  handleSetTrip = (tripId, e) => {
    const { allTrips } = this.props;
    // const tripId = e.target.dataset.tripid;
    // const tripId = e.target.value;
    // console.log('alltrips:', allTrips);
    console.log('tripId:', tripId);
    const [formattedTrip, tripName] = loadTripData(allTrips.trips, +tripId);
    console.log('formattedTrip:', formattedTrip);
    this.props.dispatchSetTrip(formattedTrip);
    this.props.dispatchSetTripName(tripName);
  };
  handleDeleteTrip = (tripId, e) => {
    const { dispatchDeleteTrip, userId } = this.props;
    dispatchDeleteTrip(tripId, userId);
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
    });
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
                    $$$
                  </div>
                  <div style={{ width: '33%', textAlign: 'right' }}>
                    <button className="button is-danger is-outlined">
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
          props: ({ data: { loading, allTrips } }) => ({ loading, allTrips }),
        })(MyTrips);

        export default withRouter(connect(mapState, mapDispatch)(ApolloMyTrips));
