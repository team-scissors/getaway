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
            <div className="tabs is-toggle is-fullwidth">
              <ul>
                <li
                  className={
                    location.pathname === '/flights' ? 'is-active' : ''
                  }
                >
                  <NavLink to="/flights" activeClassName="is-active">
                    <span className="icon is-small">
                      <i className="fa fa-dot-circle-o" />
                    </span>
                    <span>Explore</span>
                  </NavLink>
                </li>
                <li className={location.pathname === '/map' ? 'is-active' : ''}>
                  <NavLink to="/map" activeClassName="is-active">
                    <span className="icon is-small">
                      <i className="fa fa-map" />
                    </span>
                    <span>Map</span>
                  </NavLink>
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
