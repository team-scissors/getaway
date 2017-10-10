/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { graphql } from 'react-apollo';
import { tripsByUserId } from './util_helper';

class MyTrips extends Component {


  render() {
    const {
      // myTrips,
      currentTripName,
      trips,
      loading,
    } = this.props;
    const myTrips = !loading ?
      trips.trips.map(trip => {
        return ({
          id: trip.id,
          name: trip.name,
        });
      }) : '';
    return (
      <div>
        <nav className="panel flight-list">
          {myTrips &&
            myTrips.map(trip => {
              const active = trip.name === currentTripName;
              return (
                <a
                  // onClick={this.handleLoadTrip}
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

const mapDispatch = () => ({});

const ApolloMyTrips = graphql(tripsByUserId, {
  options: ({ userId }) => ({ variables: { id: userId } }),
  props: ({ data: { loading, allTrips } }) => ({ loading, trips: allTrips }),
})(MyTrips);

export default withRouter(connect(mapState, mapDispatch)(ApolloMyTrips));
