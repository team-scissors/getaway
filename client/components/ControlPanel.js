import React, { Component } from 'react';
import {connect} from 'react-redux';
import { graphql } from 'react-apollo';

import { setAirportInput, clearInputAirport } from '../store/user-input';
import { flightsFromAirportByAbbrv } from './util_helper';

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
    this.props.dispatchSetAirportInput(this.state.value);
  }

  render() {
    return (
      <div className="field">
        <form onSubmit={this.handleSubmit}>
          {/* <input className="input" type="text" placeholder="select origin airport" /> */}
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
  return { state };
};

const mapDispatch = dispatch => {
  return {
      dispatchSetAirportInput(input) {
        dispatch(setAirportInput(input));
      }
  };
};
//
// // See ./util_helper/graphQLqueries.js for queries
// const ApolloControlPanel = graphql(flightsFromAirportByAbbrv, {
//   options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
//   // props: ({ data: { loading, departFrom } }) => ({ loading, departFrom }),
// })(ControlPanel);

// export default connect(mapState, mapDispatch)(ApolloControlPanel);
export default connect(mapState, mapDispatch)(ControlPanel);
