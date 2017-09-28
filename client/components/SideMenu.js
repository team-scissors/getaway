import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';

class SideMenu extends Component {
  render() {
    const { children, handleClick, isLoggedIn } = this.props;
    return <div />;
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
