import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { setAirport } from '../store/user-input';
import { getSelectedDestinationAirport } from '../store';
import scrollIntoView from 'scroll-into-view';
import { flightsFromAirportByAbbrv } from './util_helper';

/**
 * COMPONENT
 */
class FlightListPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleDestClick = e => {
    const abbrv = e.currentTarget.dataset.abbrv;
    const flightList = this.props.departFrom.flights.nodes.slice();
    const flight = flightList.find(f => {
      return f.arriveAt.abbrv === abbrv;
    });
    this.props.selectDestinationAirport(flight.arriveAt);
  };

  handleShow = abbrv => {
    scrollIntoView(this.refs[abbrv]);
  };

  render() {
    const { departFrom, selectedDestination } = this.props;
    let airportList = departFrom ? departFrom.flights.nodes.slice() : [];

    if (airportList.length > 0) {
      airportList.sort((a, b) => {
        return a.price - b.price;
      });
      airportList = airportList.filter(airport => {
        return airport.price < this.props.maxPrice;
      });
    }

    if (selectedDestination.abbrv) {
      this.handleShow(selectedDestination.abbrv);
    }

    return (
      <div>
        <nav className="panel flight-list">
          {airportList.map(item => {
            const airport = item.arriveAt;
            const active = selectedDestination.abbrv === airport.abbrv;
            return (
              <a
                className={`panel-block 
                ${active ? 'is-active' : ''} list-item`}
                key={airport.id}
                onClick={this.handleDestClick}
                style={active ? { background: '#00d1b2', color: '#fff' } : {}}
                ref={airport.abbrv}
                data-abbrv={airport.abbrv}
              >
                <span
                  className="panel-icon"
                  style={active ? { color: '#fff' } : {}}
                >
                  <i className="fa fa-plane" />
                </span>
                <div>
                  <strong>{`${airport.abbrv}`}</strong>
                  {` ${airport.city}, ${airport.country}  `}
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  {`$${Math.trunc(item.price)}`}
                </div>
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
    maxPrice: state.userInput.maxPrice,
  };
};

const mapDispatch = dispatch => {
  return {
    selectDestinationAirport(selectedAirport) {
      dispatch(getSelectedDestinationAirport(selectedAirport));
    },
  };
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
