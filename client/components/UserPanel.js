import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';

/**
 * COMPONENT
 */
class UserPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div>
        {isLoggedIn ? (
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

/**
 * CONTAINER
 */
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

export default connect(mapState, mapDispatch)(UserPanel);
