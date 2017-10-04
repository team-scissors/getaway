import React, { Component } from 'react';
import {connect} from 'react-redux';
import { graphql } from 'react-apollo';

import { setAirport } from '../store/user-input';
import { airportByAbbrv } from './util_helper';

/**
 * COMPONENT
 */
class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    console.log('this.props.setAirportInput:');
    console.log(this.props.setAirportInput);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({value: evt.target.value});
  }

  handleSubmit(evt) {
    evt.preventDefault();
    console.log(this.state.value);
    this.props.dispatchSetAirport(this.state.value);
  }

  render() {
    return (
      <div className="field">
        <form onSubmit={this.handleSubmit}>
          <input
                 className="input"
                 type="text"
                 value={this.state.value}
                 onChange={this.handleChange}
                 placeholder="select origin airport"
          />
          <button className="button is-primary">Set Departing Airport</button>
        </form>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return { };
};

const mapDispatch = dispatch => {
  return {
    dispatchSetAirport(input) {
      dispatch(setAirport(input));
    }
  };
};

// export default connect(mapState, mapDispatch)(ApolloControlPanel);
export default connect(mapState, mapDispatch)(ControlPanel);
