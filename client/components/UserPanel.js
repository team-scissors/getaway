import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { logout } from '../store';

/**
 * COMPONENT
 */
class UserPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) { }

  render() {
    const { isLoggedIn, dispatchLogout } = this.props;

    return (
      <div className="sidenav-top-container">
        <div className="tabs is-toggle is-fullwidth">
        {/* REVIEW: prefer making more components*/}
        {/* isLoggedIn ? <LoggedIn/> : <LoggedOut/> */}
        {/* isLoggedIn ? this.renderLoggedIn() : this.renderLoggedOut() */}
        {
          isLoggedIn
          ? (<ul>
              <li>
                <a className="button is-white" onClick={dispatchLogout}>
                  <span>Logout</span>
                </a>
              </li>
            </ul>)
          : (<ul>
              <li>
                <NavLink to="/login" activeClassName="is-active">
                  <span className="icon is-small">
                    <i className="fa fa-user" />
                  </span>
                  <span>Login</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" activeClassName="is-active">
                  <span className="icon is-small">
                    <i className="fa fa-user-plus" />
                  </span>
                  <span>Signup</span>
                </NavLink>
              </li>
            </ul>
          )}

        </div>
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
    dispatchLogout() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(UserPanel);


