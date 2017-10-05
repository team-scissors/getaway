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

    console.log('airports:', airports);
    console.log('cur abbrv:', airportAbbrv);

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
            // abbrv: flight.arriveAt.abbrv,
            name: flight.arriveAt.name,
            price: +flight.price,
            country: flight.arriveAt.country,
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
          return airport.price < 1000;
        });
    }

    console.log('airports data:', airport_data);
    console.log(this.props);

    return (
      <VictoryChart
        animate={{ duration: 1000, easing: 'quadInOut' }}
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
          style={{ data: { fill: 'tomato' } }}
          labels={d =>
            `${d.name}, ${d.country} \n Price:$${Math.trunc(d.price)}`}
          // labels={d => `${d.abbrv}`}
          labelPlacement="vertical"
          labelComponent={<VictoryTooltip />}
          x="bearing"
          y="price"
          data={airport_data}
          events={[{
            target: 'data',
            eventHandlers: {
              onClick: (e) => {
                console.log("Dot clicked");
                return [
                  {
                    target: 'data',
                    mutation: (props) => {
                      const airportData = props.datum
                      const selectedAirport = {
                        name: airportData.name,
                        price: airportData.price,
                        country: airportData.country
                      };

                      selectDestinationAirport(selectedAirport);
                    }
                  }
                ];
              },
              //mouse over increases size of the dot
              // onMouseOver: () => {
              //   console.log('dot mouse over');
              //   return [{
              //     target: 'data',
              //     mutation: (props) => {
              //       return {
              //         size: 12,
              //       };
              //     }
              //   }];
              // },
              //mouse out decreases size of the dot
              // onMouseOut: () => {
              //   console.log('dot mouse out');
              //   return [{
              //     target: 'data',
              //     mutation: (props) => {
              //       return {
              //         size: 3,
              //       };
              //     }
              //   }];
              // },
            }
          }]}
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
    airportAbbrv: state.userInput.originAirportAbbrv,
  };
};

const mapDispatch = dispatch => {
  return {
    selectDestinationAirport(selectedAirport){
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
