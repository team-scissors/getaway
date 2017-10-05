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
      <div>
        <nav className="panel flight-list">
          {airportList.map(item => {
            const airport = item.arriveAt;
            return (
              <a className="panel-block list-item" key={airport.id}>
                <div>
                  <strong>{`${airport.abbrv}`}</strong>
                  {` ${airport.city}, ${airport.country}  `}
                </div>
                <div>{`$${Math.trunc(item.price)}`}</div>
              </a>
            );
          })}
        </nav>
      </div>
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
