const router = require('express').Router();
const {Flight} = require('../db/models');
module.exports = router;

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;

router.get('/:origin/:date', (req, res, next) => {
  console.log('requested path:', req.path);
  const amadeusURL =
    'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search';
  const origin = req.params.origin;
  const date = req.params.date;
  console.log(`origin: [${origin}] date: [${date}]`);
  const params = {
    apikey: AMADEUS_API_KEY,
    origin: origin,
    departure_date: date,
    'one-way': true,
  };
  const attributes = [
    'id',
    'name',
    'abbrv',
    'city',
    'country',
    'continent',
    'longitude',
    'latitude',
  ];
  async function buildAndSendResults() {
    const axiosResponse = await axios.get(amadeusURL, {
      params,
    });
    const amadeusResponse = axiosResponse.data;
    const originAirport = await Airport.find({
      where: { abbrv: amadeusResponse.origin },
      attributes,
    });
    const promises = amadeusResponse.results.map(result => {
      return Airport.find({
        where: { abbrv: result.destination },
        attributes,
      });
    });
    const destinationAirports = [];
    for (let promise of promises) {
      destinationAirports.push(await promise);
    }
    const flights = destinationAirports
      .map((destinationAirport, idx) => {
        // TODO: Get airport list that inclues all Amadeus airports
        if (destinationAirport === null) return;
        const originCoords = {
          latitude: originAirport.latitude,
          longitude: originAirport.longitude,
        };
        const destCoords = {
          latitude: destinationAirport.latitude,
          longitude: destinationAirport.longitude,
        };
        const bearing =
          (90 - geolib.getBearing(originCoords, destCoords)) % 360;
        const distance = geolib.getDistance(originCoords, destCoords);
        const dest = { ...destinationAirport };
        const price = +amadeusResponse.results[idx].price;
        return {
          airport: destinationAirport,
          bearing: bearing,
          distance: distance / 1000, // Convert to km
          price: price,
          priceEfficiency: 1 / (price / distance),
        };
      })
      .filter(airport => airport !== undefined);
    const result = { origin: originAirport, date: date, destinations: flights };
    res.send(result);
  }
  buildAndSendResults();
});

router.get('/', (req, res, next) => {
  //find flights by departure date and max price
  if (req.query.departureDate && req.query.maxPrice ){
    Flight.findAll({
      where: {
        departAt: req.query.departureDate,
        price: {
          lte: req.query.maxPrice
        }
      }
    })
      .then(flights => res.json(flights))
      .catch(next);
  }
  //find flights by departure date
  else if (req.query.departureDate){
    Flight.findAll({
      where: {
        departAt: req.query.departureDate,
      }
    })
      .then(flights => res.json(flights))
      .catch(next);
  }
});

// Finds all flights by departure date. Make sure the date param
// looks something like '02-01-2018', NOT '02/01/2018' OR '2-1-18'
router.get('/:date', async (req, res, next) => {
  const date = req.params.date;
  try {
    const filteredFlights = await Flight.findAll({
      where: {
        departAt: date,
      }
    })
    res.json(filteredFlights);
  } catch(err) {
    next(err)
  }
});
