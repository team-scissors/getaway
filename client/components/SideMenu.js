import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';

class SideMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    return (
      <div id="sidedrawer" className="mui--z3">
        <div id="sidedrawer-brand" className="mui--appbar-line-height">
          <span className="mui--text-title">GETAWAY</span>
        </div>
        <div className="mui-divider" />
        <ul>
          <li>
            <strong>Category 1</strong>
            <ul>
              <li>
                <a href="#">Item 1</a>
              </li>
              <li>
                <a href="#">Item 2</a>
              </li>
              <li>
                <a href="#">Item 3</a>
              </li>
            </ul>
          </li>
          <li>
            <strong>Category 2</strong>
            <ul>
              <li>
                <a href="#">Item 1</a>
              </li>
              <li>
                <a href="#">Item 2</a>
              </li>
              <li>
                <a href="#">Item 3</a>
              </li>
            </ul>
          </li>
          <li>
            <strong>Category 3</strong>
            <ul>
              <li>
                <a href="#">Item 1</a>
              </li>
              <li>
                <a href="#">Item 2</a>
              </li>
              <li>
                <a href="#">Item 3</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(SideMenu));
