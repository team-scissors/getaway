import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import { ControlPanel, FlightListPanel } from '../components';

class SideMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    const { match, location, history } = this.props;

    return (
      <div className="column is-narrow sidenav">
        <aside className="menu menu-wrapper">
          <div className="sidenav-top-container">
            <div class="tabs is-toggle is-centered">
              <ul>
                <li
                  className={
                    location.pathname === '/flights' ? 'is-active' : ''
                  }
                >
                  <NavLink to="/flights" activeClassName="is-active">
                    Flights
                  </NavLink>
                </li>
                <li
                  className={
                    location.pathname === '/rideshare' ? 'is-active' : ''
                  }
                >
                  <NavLink to="/rideshare" activeClassName="is-active">
                    Rideshare
                  </NavLink>
                </li>
                <li>
                  <a>Roadtrip</a>
                </li>
                <li>
                  <a>My Trips</a>
                </li>
              </ul>
            </div>
            <p className="menu-label">Travel Options</p>
            <ul className="menu-list">
              <li />
              {/* <li>
              </li> */}
            </ul>
            <ControlPanel />
          </div>
          <div className="sidenav-mid-container">
            {location.pathname === '/flights' && <FlightListPanel />}
          </div>
        </aside>
      </div>
    );
  }
}

const mapState = state => {
  return {
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

export default withRouter(connect(mapState, mapDispatch)(SideMenu));
