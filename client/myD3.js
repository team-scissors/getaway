// var data = d3.range(0, 2 * Math.PI, .01).map(function(t) {
//   return [t, Math.sin(2 * t) * Math.cos(2 * t)];
// });

import {  }

var width = screen.width,
    height = screen.height,
    radius = Math.min(width, height) / 2 - 30;

var r = d3.scale.linear()
    .domain([0, 500])
    .range([0, radius]);

// var line = d3.svg.line.radial()
//     .radius(function(d) { return r(d[1]); })
//     .angle(function(d) { return -d[0] + Math.PI / 2; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

import

var gr = svg.append("g")
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

/*
  Pass this an array of objects of airport:
  airport {
    name: MKE,
    latitude: 43.038902,
    longitude: -87.906471,
    price: 287,
    bearing: 349,
  }
*/
function renderDots(airports) {
  airports.forEach(airport => {
    svg.append("circle")
    .attr("cy", - airport.price - 7)
    .attr("transform", `rotate(${airport.bearing})`)
    .attr("r", 5)
    .style("fill", "steelblue")
  })
}

const fakeAirports = [
  {
    name: 'MKE',
    latitude: 43.038902,
    longitude: -87.906471,
    price: 287,
    bearing: 349,
  },
  {
    name: 'MKE',
    latitude: 43.038902,
    longitude: -87.906471,
    price: 287,
    bearing: 349,
  },
  {
    name: 'MKE',
    latitude: 43.038902,
    longitude: -87.906471,
    price: 287,
    bearing: 349,
  },
];

renderDots(fakeAirports);

// Little blue circle. Try to make this appear along the appropriate axis:
// svg.append("circle")
//   .attr("cy", - 400 - 7)
//   .attr("transform", "rotate(349)")
//   .attr("r", 4)
//   .style("fill", "steelblue")

var ga = svg.append("g")
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
    .text(function(d) { return d; }); //cardinals[d]

svg.append("path")
    // .datum(data)
    // .attr("class", "line")
    // .attr("d", line);
