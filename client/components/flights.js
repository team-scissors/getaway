import geolib from 'geolib';
import * as d3 from 'd3';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { fetchAirports } from '../store';


class Flights extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadAirports();
  }

  // This tells React not to re-render this component even if
  // state or props change.
  // Read this! https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate
  shouldComponentUpdate(nextProps, nextState) {
    // Do the D3 render here. And then return false. This wll save us from having
    // to redraw the whole D3 SVG every time the props change.
    console.log('shouldComponentUpdate just ran!');
    return false;
  }

  // // We probably don't need this. It wont run if shouldComponentUpdate returns
  // // which we want it to.
  // // Here, we'll pass in data that we want D3 to render.
  // componentWillUpdate(nextProps, nextState) {
  //
  // }

  renderFlightsD3(node) {
    // const node = this.refs.d3Target;
    // console.log('node:');
    // console.log(node);
    const airports = this.props.airports;
    console.log('this.props.airports', airports);

    const width = screen.width,
        height = screen.height,
        radius = Math.min(width, height) / 2 - 30;

    const r = d3.scaleLinear()
        .domain([0, 500])
        .range([0, radius]);

    const svg = d3.select(node).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const gr = svg.append("g")
        .attr("class", "r axis")
        .selectAll("g")
        .data(r.ticks(5).slice(1))
        .enter().append("g");

    gr.append("circle")
        .attr("r", r);

    gr.append("text")
        .attr("y", function(d) { return -r(d) - 4; })
        .attr("transform", "rotate(15)")
        .style("text-anchor", "middle")
        .text(function(d) { return '$' + d; });

    const chicago = {
      latitude: 41.881832,
      longitude: -87.623177,
    };


    const filteredAirports = airports.map(airport => {
      const otherAirport = {
        latitude: airport.latitude,
        longitude: airport.longitude,
      };
     return {
       price: 250,
       bearing: geolib.getBearing(chicago, otherAirport),
     };
    });

    function renderDots(airports) {
      airports.forEach(airport => {
        svg.append("circle")
        .attr("cy", -airport.price - 7)
        .attr("transform", `rotate(${airport.bearing})`)
        .attr("r", 8)
        // Apply a label?
        .style("fill", "steelblue")
      });
    }

    renderDots(filteredAirports);

    const ga = svg.append("g")
        .attr("class", "a axis")
        .selectAll("g")
        .data(d3.range(0, 360, 30))
        .enter().append("g")
        .attr("transform", function(d) { return "rotate(" + -d + ")"; });

    ga.append("line")
        .attr("x2", radius);

    const cardinals = {
      0: 'N',
      30: 'NNE',
      60: 'ENE',
      90: 'E',
      120: 'ESE',
      150: 'SSE',
      180: 'S',
      210: 'SSW',
      240: 'WSW',
      270: 'W',
      300: 'WNW',
      330: 'NNW',
    }

    ga.append("text")
        .attr("x", radius + 6)
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
        .attr("transform", function(d) {
          return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null;
        })
        .text(function(d) { return cardinals[d]; }); //cardinals[d]

    svg.append("path")
  }

  render() {
    return (
      <div>
        <div ref={node => this.renderFlightsD3(node)} />
      </div>
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
      fetchAirports();
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Flights));
