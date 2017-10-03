import * as d3 from 'd3';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';

import { fetchAirports } from '../store';
import { getAirportsData, cardinals, ticketPrices } from './util_helper';

class Flights extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderFlightsD3 = this.renderFlightsD3.bind(this);
  }

  componentDidMount() {
    this.props.loadAirports();
    // this.props.loadFlightPrices();
    this.renderFlightsD3();
  }

  componentDidUpdate(){
    this.renderFlightsD3();
  }

  renderFlightsD3() {
    const node = this.node;

    //setting radius equal to the minimum of height or width of the screen
    const width = screen.width,
      height = screen.height,
      radius = Math.min(width, height) / 2 - 30;

    //using linear scale to scale the radius as per the range of the ticket prices
    const r = d3.scaleLinear()
      .domain([0, d3.max(ticketPrices(this.props.airports))])
      .range([0, radius]);

    //making svg responsive to the size of the screen
    const svg = d3.select(node)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .append("g")
      .attr('transform', 'translate(' + Math.min(width, height) / 2 + ',' + Math.min(width, height) / 2 + ')');

    //appending circles to the axis
    const gr = svg.append("g")
      .attr("class", "r axis")
      .selectAll("g")
      .data(r.ticks(10).slice(1))
      .enter().append("g");

    gr.append("circle")
      .attr("r", r)
      .style("stroke", "#0F5BA7");

    //appening price range to each circle
    gr.append("text")
      .attr("y", function(d) { return -r(d) - 2; })
      .attr("transform", "rotate(15)")
      .style("font-size", "10px")
      .style("fill", "#0F5BA7")
      .style("text-anchor", "middle")
      .text(function(d) { return '$' + d; });

    gr.append("text")
      .attr("y", function(d) { return -r(d) - 2; })
      .attr("transform", "rotate(135)")
      .style("font-size", "10px")
      .style("fill", "#0F5BA7")
      .style("text-anchor", "middle")
      .text(function(d) { return '$' + d; });

    gr.append("text")
      .attr("y", function(d) { return -r(d) - 2; })
      .attr("transform", "rotate(255)")
      .style("font-size", "10px")
      .style("fill", "#0F5BA7")
      .style("text-anchor", "middle")
      .text(function(d) { return '$' + d; });

    //appending radial axes to the svg element
    const ga = svg.append("g")
      .attr("class", "a axis")
      .selectAll("g")
      .data(d3.range(0, 360, 30))
      .enter().append("g")
      .attr("transform", function(d) { return "rotate(" + d + ")"; });

    //appending line to the radial axes
    ga.append('line')
      .attr('x2', radius)
      .style("stroke", "#0F5BA7")
      .style("stroke-dasharray", "1, 10");

    //assigning the cardinal directions
    ga.append("text")
      .attr("x", radius + 6)
      .attr("dy", ".35em")
      .style("stroke", "#0F5BA7")
      .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
      .attr("transform", function(d) {
        return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null;
      })
      .text(function(d) { return cardinals[d]; });

    //closest airport to current location
    const chicago = {
      latitude: 41.881832,
      longitude: -87.623177,
    };

    // getAirportsData returns the object of arrays and each object has name, scaled price and bearing from current airport to destination airport
    const airportsData = getAirportsData(chicago, this.props.airports, r);
    console.log('airports data after scaling', airportsData);
    const gc = svg.append("g")
      .attr("class", "a axis")
      .selectAll("g")
      .data(airportsData)
      .enter()
      .append("g");

    gc.append("circle")
      .attr("cy", function(d) { return -d.price;})
      .attr("transform", function(d) { return "rotate(" + d.bearing + ")";})
      .attr("r", 5)
      .style("fill", "steelblue")
      .style("fill-opacity", 0.7)
      .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            .attr("r", 15)
            .style("fill", "maroon");
      })
      .on("mouseout", function(d) {
          d3.select(this)
            .transition()
            .attr("r", 5)
            .style("fill", "steelblue");
      });

    gc.append("text")
      .attr("y", function(d) { return -d.price - 5; })
      .attr("transform", function(d) { return "rotate(" + d.bearing + ")";})
      .style("fill", "steelblue")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            .style("fill", "maroon")
            .style("font-size", "20px");
      })
      .on("mouseout", function(d) {
          d3.select(this)
            .transition()
            .style("fill", "steelblue")
            .style("font-size", "10px");
      });

    // const gc = svg.append("g");

    // airportsData.forEach(airport => {
    //   //appends dot
    //   gc.append("circle")
    //     .attr("cy",  -airport.price)
    //     .attr("transform", `rotate(${airport.bearing})`)
    //     .attr("r", 5)
    //     .style("fill", "steelblue")
    //     .style("fill-opacity", 0.7)
    //     .on("mouseover", function(d) {
    //         d3.select(this)
    //           .transition()
    //           .attr("r", 15)
    //           .style("fill", "maroon");
    //     })
    //     .on("mouseout", function(d) {
    //         d3.select(this)
    //           .transition()
    //           .attr("r", 5)
    //           .style("fill", "steelblue");
    //     });
    //   //appends text
    //   gc.append("text")
    //     .attr("y", -airport.price - 5)
    //     .attr("transform", `rotate(${airport.bearing})`)
    //     .style("fill", "steelblue")
    //     .style("font-size", "10px")
    //     .style("text-anchor", "middle")
    //     .text(airport.name)
    //     .on("mouseover", function(d) {
    //         d3.select(this)
    //           .transition()
    //           .style("fill", "maroon");
    //     })
    //     .on("mouseout", function(d) {
    //         d3.select(this)
    //           .transition()
    //           .style("fill", "steelblue");
    //     });
    // });

    svg.append("path");
  }

  render() {
    console.log('this.props');
    console.dir(this.props);
    return (
      <svg ref={node => this.node = node } />
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    airports: state.airports,
    // flightPrices: state.flightPrices,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadAirports() {
      dispatch(fetchAirports());
    },
    // loadFlightPrices() {
    //   dispatch(fetchFlightPrices());
    // },
  };
};

const ApolloFlights = graphql(gql`
  query {
    allTrips {
      nodes {
        id
        name
      }
    }
  }
`)(Flights);


// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ApolloFlights));
