import * as _ from 'underscore';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import {
  VictoryTheme,
  VictoryPolarAxis,
  VictoryZoomContainer,
  VictoryLine,
  VictoryStack,
  VictoryBar,
  VictoryScatter,
  VictoryChart,
  VictoryGroup,
  VictoryTooltip,
  VictorySelectionContainer,
} from 'victory';
import geolib from 'geolib';

import { fetchAirports } from '../store';
import {
  getAirportsData,
  flightsFromAirportByAbbrv,
  cardinals,
  ticketPrices,
} from './util_helper';

const directions = {
  0: 'E',
  45: 'NE',
  90: 'N',
  135: 'NW',
  180: 'W',
  225: 'SW',
  270: 'S',
  315: 'SE',
};

const sampleData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 6 },
  { x: 4, y: 8 },
];
const chartStyle = {
  parent: { border: '1px solid #ccc', margin: '2%', maxWidth: '40%' },
};

class Flights extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadAirports();
  }

  componentDidUpdate() {}

  render() {
    const { airports } = this.props;
    console.log('airports:', airports);

    const chicago = {
      latitude: 41.881832,
      longitude: -87.623177,
    };

    console.log(this.props);

    let airport_data;
    if (this.props.loading) {
      airport_data = [];
    } else {
      airport_data = this.props.departFrom.flights.nodes
        .map(flight => {
          return {
            name: flight.arriveAt.name,
            price: +flight.price,
            // Victory polar is counter-clockwise
            bearing:
              (90 -
                geolib.getBearing(chicago, {
                  latitude: flight.arriveAt.latitude,
                  longitude: flight.arriveAt.longitude,
                })) %
              360,
          };
        })
        .filter(airport => {
          return airport.price < 1000;
        });
    }

    console.log('airports data:', airport_data);
    console.log(this.props);

    return (
      <VictoryChart
        polar
        width={500}
        height={500}
        domain={{ x: [0, 360] }}
        theme={VictoryTheme.material}
        domainPadding={{ y: 10 }}
        containerComponent={<VictoryZoomContainer />}
        scale={{ y: 'linear' }}
      >
        <VictoryPolarAxis // Bearing directions
          labelPlacement="parallel"
          tickValues={_.keys(directions).map(k => +k)}
          tickFormat={_.values(directions)}
          style={{
            // axis: { stroke: 'none' },
            grid: { stroke: '#888', strokeDasharray: '2, 2' },
          }}
        />
        <VictoryPolarAxis // Price rings
          dependentAxis
          labelPlacement="perpendicular"
          style={{
            axis: { stroke: 'none' },
            grid: { stroke: '#aaa', strokeDasharray: '1, 5' },
          }}
          tickCount={4}
          tickFormat={t => `$${t}`}
        />
        <VictoryScatter
          style={{ data: { fill: '#c43a31' } }}
          labels={d => d.name}
          labelPlacement="vertical"
          x="bearing"
          y="price"
          data={airport_data}
        />
      </VictoryChart>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    airports: state.airports,
    airportAbbrv: 'ORD',
  };
};

const mapDispatch = dispatch => {
  return {
    loadAirports() {
      dispatch(fetchAirports());
    },
  };
};

// See ./util_helper/graphQLqueries.js for queries
const ApolloFlights = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, departFrom } }) => ({ loading, departFrom }),
})(Flights);

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ApolloFlights));
