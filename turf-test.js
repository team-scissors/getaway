const turf = require('@turf/turf');
const path = require('path');
const jsonfile = require('jsonfile');

var extent = [-70.823364, -33.553984, -70.473175, -33.302986];
var cellSide = 5;
var units = 'miles';

var grid = turf.pointGrid(extent, cellSide, units);

grid.features.map(f => {
  console.log(f.geometry);
});
