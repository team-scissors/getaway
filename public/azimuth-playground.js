/* Calculate azimuth between Chicago and Tokyo: */
const calculate = require('azimuth');

const chicago = {
  lat: 41.8781,
  lng: -87.6298,
  elv: 0,
}

const tokyo = {
  lat: 35.6895,
  lng: 139.6917,
  elv: 0,
}

const minneapolis = {
  lat: 44.9778,
  lng: 93.2650,
  elv: 0,
}

const columbus = {
  lat: 39.9612,
  lng: 82.9988,
  elv: 0,
}

const res = calculate.azimuth(chicago, columbus);
console.log('res: ', res);
