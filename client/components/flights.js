import * as d3 from 'd3';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
    this.renderFlightsD3();
  }

  componentDidUpdate(){
    this.renderFlightsD3();
  }

  renderFlightsD3() {
    const node = this.node;

    const width = screen.width,
        height = screen.height,
        radius = Math.min(width, height) / 2 - 30;

    const r = d3.scaleLinear()
        .domain([0, d3.max(ticketPrices(this.props.airports))])
        .range([0, radius]);

    const svg = d3.select(node)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .append("g")
      .attr('transform', 'translate(' + Math.min(width, height) / 2 + ',' + Math.min(width, height) / 2 + ')');

    const gr = svg.append("g")
        .attr("class", "r axis")
        .selectAll("g")
        .data(r.ticks(25).slice(1))
        .enter().append("g");

    gr.append("circle")
        .attr("r", r);

    gr.append("text")
        .attr("y", function(d) { return -r(d) - 2; })
        .attr("transform", "rotate(0)")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text(function(d) { return '$' + d; });

    const ga = svg.append("g")
        .attr("class", "a axis")
        .selectAll("g")
        .data(d3.range(0, 360, 30))
        .enter().append("g")
        .attr("transform", function(d) { return "rotate(" + d + ")"; });

    ga.append('line').attr('x2', radius);

    ga.append("text")
        .attr("x", radius + 6)
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
        .attr("transform", function(d) {
          return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null;
        })
        .text(function(d) { return cardinals[d]; });

    const chicago = {
      latitude: 41.881832,
      longitude: -87.623177,
    };

    // getAirportsData returns the object of arrays and each object has name, scaled price and bearing from current airport to destination airport
    const airportsData = getAirportsData(chicago, this.props.airports, r);
    console.log('airports data after scaling', airportsData);

     airportsData.forEach(airport => {
       //appends dot
       console.log('airport name', airport.name);
       console.log('airport price', airport.price);
       console.log('airport bearing', airport.bearing);
      svg.append("circle")
        .attr("cy",  -airport.price)
        .attr("transform", `rotate(${airport.bearing})`)
        .attr("r", 5)
        .style("fill", "steelblue");

      //appends label to the dot
      svg.append("text")
        .attr("y", -airport.price)
        .attr("transform", `rotate(${airport.bearing})`)
        .style("fill", "red")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .text(airport.name);
    });

    svg.append("path");
  }

  render() {
    return (
      <svg ref={node => this.node = node }></svg>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    airports: state.airports,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadAirports() {
      dispatch(fetchAirports());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Flights));
