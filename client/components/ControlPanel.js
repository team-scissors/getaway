import React from 'react';
import {connect} from 'react-redux';

/**
 * COMPONENT
 */
const ControlPanel = props => {

  return (
    <div>
      <form>
        <label>Select Airport by Abbreviation</label>
        <input type="text" />
        <button>Set Departing Airport</button>
      </form>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return { state };
};

const mapDispatch = dispatch => {
  return { };
};

export default connect(mapState, mapDispatch)(ControlPanel);
