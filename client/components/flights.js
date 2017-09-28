import rd3 from 'react-d3-library';
import node from '../myD3';
import React, { Component } from 'react';
const RD3Component = rd3.Component;

export default class Flights extends Component {
  constructor(props) {
    super(props);
    this.state = {d3: ''}
  }

  componentDidMount() {
    this.setState({d3: node});
  }

  render() {
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    );
  }
}
