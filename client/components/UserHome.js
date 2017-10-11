import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const { email } = props;

  return (
    <div>
      <h3 style={{marginTop: "2em"}} className='title is-4 has-text-centered'>Welcome, {email}!</h3>
      <div style={{marginTop: "1em"}} className='subtitle has-text-centered is-5'>Where is your next get away place?</div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email,
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
};
