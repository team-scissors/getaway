import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import * as _ from 'underscore';

class MyTrips extends Component {

  render() {
    console.log('in the MyTrips component!');
    return (
      <div className="column is-narrow trip-menu">
        <h1>Hello, World!</h1>
      </div>
    );
  }
}

const mapState = state => {
  return {
    trips: state.trips,
    isLoggedIn: !!state.user.id,
    userId: state.user.id,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchSaveTrip: (userId, name) => {
      dispatch(createTrip({ userId, name }));
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(MyTrips));
