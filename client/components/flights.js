import * as d3 from 'd3';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchAirports } from '../store';
import { getAirportsData, cardinals } from './util_helper';

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

  // This tells React not to re-render this component even if
  // state or props change.
  // Read this! https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate
  // shouldComponentUpdate(nextProps, nextState) {
  //   // Do the D3 render here. And then return false. This wll save us from having

  //   // to redraw the whole D3 SVG every time the props change.
  //   console.log('shouldComponentUpdate just ran!');
  //   this.renderFlightsD3(this.d3Node);
  //   return false;
  // }

  // // We probably don't need this. It wont run if shouldComponentUpdate returns
  // // which we want it to.
  // // Here, we'll pass in data that we want D3 to render.
  // componentWillUpdate(nextProps, nextState) {
  //
  // }

  renderFlightsD3() {
    const node = this.node;

    const width = screen.width,
        height = screen.height,
        radius = Math.min(width, height) / 2 - 30;

    const r = d3.scaleLinear()
        .domain([0, 500])
        .range([0, radius]);


    const svg = d3.select(node)
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

     const airportsData = getAirportsData(chicago, this.props.airports);

     airportsData.forEach(airport => {
      console.log(airport.bearing);
      svg.append("circle")
      .attr("cy", - airport.price - 7)
      .attr("transform", `rotate(${airport.bearing})`)
      .attr("r", 8)
      // Apply a label?
      .style("fill", "steelblue")
    });

    svg.append("path");
  }

  render() {
    return (
      <svg ref={node => this.node = node }></svg>
    );
  }
}

// <div>
//         <div ref={d3Node => { this.d3Node = d3Node; this.renderFlightsD3(d3Node); }} />
//       </div>
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
