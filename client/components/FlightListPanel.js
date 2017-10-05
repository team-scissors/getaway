import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { setAirport } from '../store/user-input';
import { flightsFromAirportByAbbrv } from './util_helper';

/**
 * COMPONENT
 */
class FlightListPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { departFrom } = this.props;
    const airportList = departFrom ? departFrom.flights.nodes.slice() : [];
    if (airportList.length > 0) {
      airportList.sort((a, b) => {
        return a.price - b.price;
      });
    }

    return (
      <nav className="panel flight-list">
        {airportList.map(airport => {
          return (
            <a className="panel-block" key={airport.arriveAt.id}>
              <span className="panel-icon">
                <i className="fa fa-plane" />
              </span>
              {`${airport.arriveAt.city}, ${airport.arriveAt.country}:  `}
              {`$${Math.trunc(airport.price)}`}
            </a>
          );
        })}
      </nav>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    selectedDestination: state.userInput.selectedDestinationAirport,
    airportAbbrv: state.userInput.originAirportAbbrv,
  };
};

const mapDispatch = dispatch => {
  return {};
};

const ApolloFlightListPanel = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, departFrom } }) => ({ loading, departFrom }),
})(FlightListPanel);

// // See ./util_helper/graphQLqueries.js for queries
// const ApolloFlightListPanel = graphql(airportByAbbrv, {
//   options: ({ abbrv }) => ({ variables: { airportAbbrv: abbrv } }),
//   props: ({ data: { loading, departFrom } }) => ({ loading, departFrom }),
// })(FlightListPanel);

export default connect(mapState, mapDispatch)(ApolloFlightListPanel);
