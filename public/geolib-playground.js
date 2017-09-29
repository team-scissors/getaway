const geolib = require('geolib');

const chicago = {
  latitude: 41.881832,
  longitude: -87.623177,
}

const milwaukie = {
  latitude: 43.038902,
  longitude: -87.906471,
}

const bearing = geolib.getBearing(milwaukie, chicago);
console.log(bearing);
