import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import { ControlPanel } from '../components';

class SideMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    const { match, location, history } = this.props;

    //console.log(`Location: ${location.pathname}`);

    return (
      <div className="column is-narrow is-fullheight sidenav">
        <aside className="menu">
          <p className="menu-label">Travel Options</p>
          <ul className="menu-list">
            <li>
              <NavLink to="/flights" activeClassName="is-active">
                Flights
              </NavLink>
            </li>
            <li>
              <NavLink to="/rideshare" activeClassName="is-active">
                Uber Rides
              </NavLink>
            </li>
          </ul>
          <ControlPanel />
        </aside>
        <p className="menu-label">User</p>
        {// console.log(this.state.value);
        isLoggedIn ? (
          <ul className="menu-list">
            <li>
              <a className="button is-white" onClick={handleClick}>
                Logout
              </a>
            </li>
          </ul>
        ) : (
          <ul className="menu-list">
            <li>
              <NavLink to="/login" activeClassName="is-active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" activeClassName="is-active">
                Sign up
              </NavLink>
            </li>
          </ul>
        )}
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
