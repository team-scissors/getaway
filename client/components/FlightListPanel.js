import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { setAirport } from '../store/user-input';
import { setCurrentFlight } from '../store';
import scrollIntoView from 'scroll-into-view';
import {
  flightsFromAirportByAbbrv,
  flightsFromAirportByAbbrvAndDate,
} from './util_helper';

/**
 * COMPONENT
 */
class FlightListPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    if (!this.props.loading) {
      console.log('this.props', this.props);
      this.props.refetch();
    }
  }

  handleDestClick = e => {
    const abbrv = e.currentTarget.dataset.abbrv;
    const flightList = this.props.origin.flights.nodes.slice();
    const flight = flightList.find(f => {
      return f.dest.abbrv === abbrv;
    });
    this.props.dispatchSetCurrentFlight(flight);
  };

  handleShow = abbrv => {
    scrollIntoView(this.refs[abbrv]);
  };

  render() {
    const { origin, currentFlight } = this.props;
    let flightList = origin ? origin.flights.nodes.slice() : [];

    if (flightList.length > 0) {
      flightList.sort((a, b) => {
        return a.price - b.price;
      });
      flightList = flightList.filter(airport => {
        return airport.price < this.props.maxPrice;
      });
    }

    if (currentFlight.dest) {
      this.handleShow(currentFlight.dest.abbrv);
    }

    return (
      <div>
        <nav className="panel flight-list">
          {flightList.map(flight => {
            const airport = flight.dest;
            const active = currentFlight.dest
              ? currentFlight.dest.abbrv === airport.abbrv
              : false;
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
                  {`$${Math.trunc(flight.price)}`}
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
    currentFlight: state.userInput.currentFlight,
    airportAbbrv: state.userInput.originAirportAbbrv,
    maxPrice: state.userInput.maxPrice,
    departureDate: state.userInput.departureDate,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchSetCurrentFlight(selectedAirport) {
      dispatch(setCurrentFlight(selectedAirport));
    },
  };
};

// const ApolloFlightListPanel = graphql(flightsFromAirportByAbbrv, {
//   options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
//   props: ({ data: { loading, origin } }) => ({ loading, origin }),
// })(FlightListPanel);
const ApolloFlightListPanel = graphql(flightsFromAirportByAbbrvAndDate, {
  options: ({ airportAbbrv, departureDate }) => ({ variables: { airportAbbrv, departureDate } }),
  props: ({ data: { loading, origin, refetch } }) => ({ loading, origin, refetch }),
})(FlightListPanel);

export default connect(mapState, mapDispatch)(ApolloFlightListPanel);
