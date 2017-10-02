const turf = require('@turf/turf');
const path = require('path');
const jsonfile = require('jsonfile');

const fileName = path.join(__dirname, './gridtest.json');

var extent = [-87.9402669, 41.6443349, -87.523661, 42.023131]; // Chicago Bounding Box

var cellSide = 1;
var units = 'miles';

var grid = turf.pointGrid(extent, cellSide, units);
jsonfile.writeFile(fileName, grid);

// grid.features.map(f => {
//   console.log(f.geometry);
// });
