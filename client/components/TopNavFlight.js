import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { logout } from '../store';
import { ControlPanel, FlightListPanel } from '../components';

class TopNavFlight extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    const { match, location, history } = this.props;

    return (
      <nav className="navbar is-white top-nav">
        <div className="navbar-item">
          <div className="field is-grouped">
            <p className="control">
              <a className="button">
                <span className="icon">
                  <i className="fa fa-twitter" aria-hidden="true" />
                </span>
                <span>Tweet</span>
              </a>
            </p>
            <p className="control">
              <a className="button is-primary">
                <span className="icon">
                  <i className="fa fa-download" aria-hidden="true" />
                </span>
                <span>Download</span>
              </a>
            </p>
          </div>
        </div>
      </nav>
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

export default withRouter(connect(mapState, mapDispatch)(TopNavFlight));
