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
            <div className="tabs is-toggle is-centered">
              <ul>
                <li
                  className={
                    location.pathname === '/flights' ? 'is-active' : ''
                  }
                >
                  <NavLink to="/flights" activeClassName="is-active">
                    <span className="icon is-small">
                      <i className="fa fa-plane" />
                    </span>
                    <span>Flights</span>
                  </NavLink>
                </li>
                <li
                  className={
                    location.pathname === '/rideshare' ? 'is-active' : ''
                  }
                >
                  <NavLink to="/rideshare" activeClassName="is-active">
                    <span className="icon is-small">
                      <i className="fa fa-car" />
                    </span>
                    <span>Rideshare</span>
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
          </div>
          <ControlPanel />
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
