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
import { setCurrentFlight } from '../store';

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

class Flights extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    const { airports, airportAbbrv, dispatchSetCurrentFlight } = this.props;

    let airport_data;
    if (this.props.loading === true) {
      airport_data = [];
    } else {
      if (this.props.origin) {
        const curAirport = {
          latitude: this.props.origin.latitude,
          longitude: this.props.origin.longitude,
        };
        airport_data = this.props.origin.flights.nodes
          .map(flight => {
            return {
              ...flight.dest,
              price: +flight.price,
              departAt: flight.departAt,
              distance: geolib.getDistance(curAirport, {
                latitude: flight.dest.latitude,
                longitude: flight.dest.longitude,
              }),
              // Victory polar is counter-clockwise
              bearing:
                (90 -
                  geolib.getBearing(curAirport, {
                    latitude: flight.dest.latitude,
                    longitude: flight.dest.longitude,
                  })) %
                360,
            };
          })
          .filter(airport => {
            return airport.price < this.props.maxPrice;
          });
      } else {
        airport_data = [];
      }
    }

    // console.log('airports data:', airport_data);
    // console.log(this.props);

    const selectedDestination = this.props.selectedDestination;
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
                fill: 'tomato',
                fillOpacity: 0.3,
              }),
            },
            onExit: {
              duration: 500,
              before: () => ({
                fill: 'tomato',
                fillOpacity: 0.3,
              }),
            },
          }}
          style={{ data: { fill: 'tomato' } }}
          labels={d =>
            `${d.abbrv}\n ${d.name} \n ${d.city}, ${d.country} \n Price:$${Math.trunc(
              d.price,
            )}`}
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
                        const a = props.datum;
                        const selectedFlight = {
                          price: a.price,
                          date: a.departAt,
                          dest: {
                            name: a.name,
                            abbrv: a.abbrv,
                            city: a.city,
                            country: a.country,
                            latitude: a.latitude,
                            longitude: a.longitude,
                          },
                        };
                        dispatchSetCurrentFlight(selectedFlight);
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
    selectedDestination: state.userInput.currentFlight,
    airportAbbrv: state.userInput.originAirportAbbrv,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchSetCurrentFlight(selectedAirport) {
      dispatch(setCurrentFlight(selectedAirport));
    },
  };
};

// See ./util_helper/graphQLqueries.js for queries
const ApolloFlights = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(Flights);

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ApolloFlights));
