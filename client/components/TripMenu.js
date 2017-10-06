import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import { ControlPanel, FlightListPanel } from '../components';

class TripMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    const { match, location, history, trip } = this.props;

    console.log('trip', trip);
    return (
      <div className="column is-narrow trip-menu">
        <aside className="menu menu-wrapper">
          <div className="sidenav-top-container">
            <div className="tabs is-toggle is-fullwidth">
              <ul>
                <li>Trip List Goes Here</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    );
  }
}

const mapState = state => {
  return {
    trip: state.userInput.currentTrip,
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(TripMenu));
