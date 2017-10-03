import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';

class SideMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    const { match, location, history } = this.props;

    console.log(`Location: ${location.pathname}`);

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
          <p className="menu-label">Controls Go Here</p>
          <ul className="menu-list">
            <li>
              <a>Team Settings</a>
            </li>
            <li>
              <a>Manage Your Team</a>
              <ul>
                <li>
                  <a>Members</a>
                </li>
                <li>
                  <a>Plugins</a>
                </li>
                <li>
                  <a>Add a member</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Invitations</a>
            </li>
            <li>
              <a>Cloud Storage Environment Settings</a>
            </li>
            <li>
              <a>Authentication</a>
            </li>
          </ul>
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
