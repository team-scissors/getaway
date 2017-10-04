import geolib from 'geolib';
import * as d3 from 'd3';

// REVIEW: is this used?

const node = document.createElement('div');

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

const aiportsLocations = [
  {"airport_id":"6891","city":"Greencastle","country":"United States","latitude":"39.6335556","longitude":"-86.8138056"},
  {"airport_id":"6890","name":"Dowagiac Municipal Airport","city":"Dowagiac","country":"United States","latitude":"41.9929342","longitude":"-86.1280125"},
  {"airport_id":"6889","name":"Cambridge Municipal Airport","city":"Cambridge","country":"United States","latitude":"39.9750278","longitude":"-81.5775833"},
  {"airport_id":"6885","name":"Door County Cherryland Airport","city":"Sturgeon Bay","country":"United States","latitude":"44.8436667","longitude":"-87.4215556"},
  {"airport_id":"6884","name":"Shoestring Aviation Airfield","city":"Stewartstown","country":"United States","latitude":"39.7948244","longitude":"-76.6471914"},
  {"airport_id":"6883","name":"Eastern Oregon Regional Airport","city":"Pendleton","country":"United States","iaco":"KPDT","latitude":"45.695","longitude":"-118.841389"},
  {"airport_id":"6882","name":"Tyonek Airport","city":"Tyonek","country":"United States","latitude":"61.076667","longitude":"-151.138056"},
]

const airports = aiportsLocations.map(airport => {
  const otherAirport = {
    latitude: airport.latitude,
    longitude: airport.longitude,
  };
 return {
   price: 200,
   bearing: geolib.getBearing(chicago, otherAirport),
 }
});

function renderDots(airports) {
  airports.forEach(airport => {
    svg.append("circle")
    .attr("cy", - airport.price - 7)
    .attr("transform", `rotate(${airport.bearing})`)
    .attr("r", 5)
    .style("fill", "steelblue")
  })
}

renderDots(airports);

// Little blue circle. Try to make this appear along the appropriate axis:
// svg.append("circle")
//   .attr("cy", - 400 - 7)
//   .attr("transform", "rotate(349)")
//   .attr("r", 4)
//   .style("fill", "steelblue")

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
    .text(function(d) { return d; }); //cardinals[d]

svg.append("path")
    // .datum(data)
    // .attr("class", "line")
    // .attr("d", line);

export default node;
