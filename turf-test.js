const turf = require('@turf/turf');
const path = require('path');
const jsonfile = require('jsonfile');

const gridPointsFile = path.join(__dirname, './gridtest.json');
const isobandsFile = path.join(__dirname, './isobands.json');

var extent = [-87.9402669, 41.6443349, -87.523661, 42.023131]; // Chicago Bounding Box

var cellSide = 0.5;
var units = 'miles';

var grid = turf.pointGrid(extent, cellSide, units);
for (var i = 0; i < grid.features.length; i++) {
  // grid.features[i].properties.price = Math.random() * 100;
  grid.features[i].properties.price =
    Math.random() * (i / grid.features.length) * 100;
}

breaks = [0, 25, 50, 75];
var isobands = turf.isobands(grid, breaks, 'price');

jsonfile.writeFile(gridPointsFile, grid);
jsonfile.writeFile(isobandsFile, isobands);

// grid.features.map(f => {
//   console.log(f.geometry);
// });
