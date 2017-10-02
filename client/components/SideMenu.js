import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';

class SideMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    return (
      <div className="column is-narrow is-fullheight sidenav">
        <aside className="menu">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a>Customers</a>
            </li>
          </ul>
          <p className="menu-label">Administration</p>
          <ul className="menu-list">
            <li>
              <a>Team Settings</a>
            </li>
            <li>
              <a className="is-active">Manage Your Team</a>
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
          <p className="menu-label">Transactions</p>
          <ul className="menu-list">
            <li>
              <a>Payments</a>
            </li>
            <li>
              <a>Transfers</a>
            </li>
            <li>
              <a>Balance</a>
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
