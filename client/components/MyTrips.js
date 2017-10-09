/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  trips,
  fetchTrips,
} from '../store';
// REVIEW: install individual underscore methods
// do not import things you do not use
import * as _ from 'underscore';


//export {
//  warn: process.env.LOG_LEVEL > 2 ? console.warn ? funciton () {}
//}
//
//class AppComponent extends React.Component {
//  log () {
//    if (this.props.loggerOn) {
//    }
//  }
//  warn () {}
//}

import ourLogger from './logger';
class MyTrips extends AppComponent {

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
    // REVIEW: Clean up after yourself
    ourLogger.warn('soteuhonetuhaosentuhsoteusant');
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
