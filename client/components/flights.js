import * as _ from 'underscore';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import {
  VictoryTheme,
  VictoryLegend,
  VictoryPolarAxis,
  VictoryZoomContainer,
  VictoryLine,
  VictoryLabel,
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

const regions = {
  Europe: '#66c2a5',
  Oceania: '#fc8d62',
  Asia: '#8da0cb',
  NorthAmerica: '#e78ac3',
  Africa: '#a6d854',
  SouthAmerica: '#ffd92f',
};

const regionLegendLabels = [
  { name: 'Europe', symbol: { fill: regions['Europe'] } },
  { name: 'Oceania', symbol: { fill: regions['Oceania'] } },
  { name: 'Asia', symbol: { fill: regions['Asia'] } },
  { name: 'North America', symbol: { fill: regions['NorthAmerica'] } },
  { name: 'Africa', symbol: { fill: regions['Africa'] } },
  { name: 'South America', symbol: { fill: regions['SouthAmerica'] } },
];

const primary = '#00D1B2';

const innerRadius = 35;
class CompassCenter extends React.Component {
  render() {
    const { origin, airportAbbrv } = this.props;
    const circleStyle = {
      stroke: primary,
      strokeWidth: 2,
      fill: 'none',
    };
    const textStyle = {
      stroke: primary,
      strokeWidth: 2,
      fill: 'none',
    };
    return (
      <g>
        <circle
          cx={origin.x}
          cy={origin.y}
          r={innerRadius}
          style={circleStyle}
        />
        <text
          x={origin.x}
          y={origin.y + 7}
          font-size="20px"
          text-anchor="middle"
          style={textStyle}
        >
          {airportAbbrv}
        </text>
      </g>
    );
  }
}

class Flights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airportData: [],
    };
  }

  createAirportData = (origin, maxPrice) => {
    let airport_data = [];
    if (!origin) return airport_data;
    const curAirport = {
      latitude: origin.latitude,
      longitude: origin.longitude,
    };
    airport_data = origin.flights.nodes
      .filter(flight => {
        return flight.price < maxPrice;
      })
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
      });
    return airport_data;
  };

  componentDidMount() {
    const {
      airports,
      airportAbbrv,
      selectedDestination,
      dispatchSetCurrentFlight,
    } = this.props;
  }

  componentDidUpdate() {}

  componentWillReceiveProps(nextProps) {
    const { selectedDestination, origin, maxPrice } = nextProps;
    if (this.props.selectedDestination !== selectedDestination)
      console.log('diff dests!');
    if (origin != this.props.origin || maxPrice != this.props.maxPrice) {
      const airportData = this.createAirportData(origin, maxPrice);
      this.setState({ airportData: airportData });
    }
  }

  render() {
    const {
      airports,
      airportAbbrv,
      selectedDestination,
      dispatchSetCurrentFlight,
    } = this.props;

    console.log('sel dest:', selectedDestination);
    const destAbbrv = selectedDestination.dest
      ? selectedDestination.dest.abbrv
      : '';

    return (
      <VictoryChart
        animate={{ duration: 500, easing: 'quadInOut' }}
        polar
        width={500}
        height={500}
        innerRadius={innerRadius}
        domain={{ x: [0, 360] }}
        theme={VictoryTheme.material}
        domainPadding={{ y: 10 }}
        containerComponent={<VictoryZoomContainer />}
        scale={{ y: 'linear' }}
      >
        <VictoryPolarAxis // Bearing directions
          labelPlacement="perpendicular"
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
        <VictoryLegend
          x={30}
          y={10}
          symbolSpacer={5}
          centerTitle
          orientation="horizontal"
          gutter={10}
          style={{ border: { stroke: 'none' }, title: { fontSize: 14 } }}
          data={regionLegendLabels}
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
          size={d => {
            return d.abbrv === destAbbrv ? 7 : 3;
          }}
          style={{
            data: {
              fill: d => {
                if (d.abbrv === airportAbbrv) {
                  return 'black';
                }
                const color =
                  d.abbrv === destAbbrv
                    ? primary
                    : regions[d.continent.replace(/\s/g, '')];
                return color;
              },
            },
          }}
          labels={d =>
            `${d.abbrv}\n ${d.name} \n ${d.city}, ${d.country} \n Price:$${Math.trunc(
              d.price,
            )}`}
          labelPlacement="vertical"
          labelComponent={
            <VictoryTooltip
              dx={10}
              dy={10}
              cornerRadius={10}
              pointerLength={0}
              flyoutStyle={{}}
            />
          }
          x="bearing"
          y="price"
          data={this.state.airportData}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: e => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        console.log('click props:', props);
                        const a = props.datum;
                        const selectedFlight = {
                          price: a.price,
                          departAt: a.departAt,
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
                        if (props.datum.abbrv !== airportAbbrv) {
                          return {
                            style: Object.assign({}, props.style, {
                              fill: primary,
                            }),
                          };
                        }
                      },
                    },
                    {
                      target: 'labels',
                      mutation: props => {
                        if (props.datum.abbrv !== airportAbbrv)
                          return { active: true };
                      },
                    },
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        return {};
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
        {/* <CompassLabel /> */}
        <CompassCenter airportAbbrv={this.props.airportAbbrv} />
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
