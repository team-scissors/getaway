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
            <ul>
              {trip.length > 0 &&
                trip.map((flight, idx) => {
                  return (
                    <li key={idx}>
                      {flight.origin.name} to {flight.dest.name}
                    </li>
                  );
                })}
            </ul>
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
