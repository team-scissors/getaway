/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  trips,
  fetchTrips,
} from '../store';
import * as _ from 'underscore';

class MyTrips extends Component {

  componentDidMount() {
    const {
      userId,
      dispatchFetchTrips,
    } = this.props;
    if (userId) dispatchFetchTrips(userId);
  }

  render() {
    const {
      myTrips,
    } = this.props;
    console.log('myTrips');
    console.log(myTrips);
    return (
      <div>
        <h1>Hello!</h1>
      </div>
    );
  }
}

const mapState = state => {
  return {
    myTrips: state.trips,
    isLoggedIn: !!state.user.id,
    userId: state.user.id,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchFetchTrips: userId => {
      dispatch(fetchTrips(userId));
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(MyTrips));
