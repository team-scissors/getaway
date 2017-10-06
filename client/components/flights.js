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

import {
  getAirportsData,
  flightsFromAirportByAbbrv,
  cardinals,
  ticketPrices,
} from './util_helper';
import { getSelectedDestinationAirport } from '../store';

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

const chartStyle = {
  parent: { border: '1px solid #ccc', margin: '2%', maxWidth: '40%' },
};

class Flights extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    const { airports, airportAbbrv, selectDestinationAirport } = this.props;

    let airport_data;
    if (this.props.loading === true) {
      airport_data = [];
    } else {
      const curAirport = {
        latitude: this.props.departFrom.latitude,
        longitude: this.props.departFrom.longitude,
      };
      airport_data = this.props.departFrom.flights.nodes
        .map(flight => {
          return {
            city: flight.arriveAt.city,
            abbrv: flight.arriveAt.abbrv,
            name: flight.arriveAt.name,
            price: +flight.price,
            country: flight.arriveAt.country,
            latitude: flight.arriveAt.latitude,
            longitude: flight.arriveAt.longitude,
            distance: geolib.getDistance(curAirport, {
              latitude: flight.arriveAt.latitude,
              longitude: flight.arriveAt.longitude,
            }),
            // Victory polar is counter-clockwise
            bearing:
              (90 -
                geolib.getBearing(curAirport, {
                  latitude: flight.arriveAt.latitude,
                  longitude: flight.arriveAt.longitude,
                })) %
              360,
          };
        })
        .filter(airport => {
          return airport.price < this.props.maxPrice;
        });
    }

    // console.log('airports data:', airport_data);
    // console.log(this.props);

    const selectedDestination = this.props.selectedDestination;
    console.log('selected dest:', selectedDestination);
    return (
      <VictoryChart
        animate={{ duration: 500, easing: 'quadInOut' }}
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
            axis: { stroke: 'none' },
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
          animate={{
            onEnter: {
              duration: 200,
              before: () => ({
                fill: 'orange',
              }),
            },
            onExit: {
              duration: 500,
              before: () => ({
                fill: 'orange',
              }),
            },
          }}
          style={{ data: { fill: 'tomato' } }}
          labels={d =>
            `${d.name} \n ${d.city}, ${d.country} \n Price:$${Math.trunc(
              d.price,
            )}`}
          // labels={d => `${d.abbrv}`}
          labelPlacement="vertical"
          labelComponent={<VictoryTooltip dx={-2} dy={10} />}
          x="bearing"
          y="price"
          data={airport_data}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: e => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        const airportData = props.datum;
                        const selectedAirport = {
                          name: airportData.name,
                          abbrv: airportData.abbrv,
                          price: airportData.price,
                          city: airportData.city,
                          country: airportData.country,
                          latitude: airportData.latitude,
                          longitude: airportData.longitude,
                        };
                        selectDestinationAirport(selectedAirport);
                      },
                    },
                  ];
                },
                onMouseOver: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        return {
                          style: Object.assign({}, props.style, {
                            fill: '#00D1B2',
                          }),
                          size: 7,
                        };
                      },
                    },
                    {
                      target: 'labels',
                      mutation: () => ({ active: true }),
                    },
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        return {
                          size: 3,
                        };
                      },
                    },
                    {
                      target: 'labels',
                      mutation: () => ({ active: false }),
                    },
                  ];
                },
              },
            },
          ]}
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
    maxPrice: state.userInput.maxPrice,
    selectedDestination: state.userInput.selectedDestinationAirport,
    airportAbbrv: state.userInput.originAirportAbbrv,
  };
};

const mapDispatch = dispatch => {
  return {
    selectDestinationAirport(selectedAirport) {
      dispatch(getSelectedDestinationAirport(selectedAirport));
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
