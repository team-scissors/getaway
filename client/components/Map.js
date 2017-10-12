import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';
import * as _ from 'underscore';
import { setMap, getPriceTin } from '../store/user-input';
import airportCoordsTest from '../../data/airportPriceTest';

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
mapboxgl.accessToken =
  'pk.eyJ1IjoidGhlc2h1byIsImEiOiJjajgyNXZhY2oyaWc4MzJzMG82dWM3Zm9mIn0._fGWYG5J5f0NwYRbVnByeQ';

const primary = '#00D1B2';
const colors = [
  '#ffffe0',
  '#f4f8db',
  '#e9f1d6',
  '#deebd0',
  '#d2e3cb',
  '#c7ddc6',
  '#bbd6c1',
  '#b1cfbc',
  '#a6c9b7',
  '#9ac2b1',
  '#8fbbac',
  '#84b4a8',
  '#78ada2',
  '#6ca79d',
  '#60a198',
  '#529a93',
  '#46938f',
  '#358d89',
  '#248685',
  '#008080',
];

const makeStops = (colorArray, minPrice, maxPrice) => {
  const n = colorArray.length;
  const interval = _.range(minPrice, maxPrice, Math.floor(maxPrice / n));
  return interval.map((val, idx) => {
    return [val, colorArray[idx]];
  });
};

const buildAirportsGeoJSON = trip => {
  const airportsGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };

  if (trip.length > 0)
    airportsGeoJSON.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [trip[0].origin.longitude, trip[0].origin.latitude],
      },
      properties: {
        city: trip[0].origin.city,
        country: trip[0].origin.country,
      },
    });

  trip.forEach(flight => {
    const destination = [flight.dest.longitude, flight.dest.latitude];
    airportsGeoJSON.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: destination,
      },
      properties: {
        city: flight.dest.city,
        country: flight.dest.country,
      },
    });
  });
  return airportsGeoJSON;
};

const buildTripGeoJSON = trip => {
  const tripGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };

  trip.forEach(flight => {
    const origin = [flight.origin.longitude, flight.origin.latitude];
    const destination = [flight.dest.longitude, flight.dest.latitude];
    tripGeoJSON.features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [origin, destination],
      },
    });
  });

  return tripGeoJSON;
};

// REVIEW: what happens when we have props?
class Map extends Component {
  componentDidMount() {
    const {
      maxPrice,
      airportAbbrv,
      tinJSON,
      departureDate,
      dispatchGetPriceTin,
    } = this.props;

    // console.log('TIN map:', tinJSON);
    dispatchGetPriceTin(
      moment(departureDate).format('YYYY-MM-DD'),
      airportAbbrv,
      maxPrice,
    );

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      // style: 'mapbox://styles/theshuo/cj82h754i9kgz2so12kkyyzon',
      center: [-87.623177, 41.881832], // Chicago
      zoom: 3,
    });

    this.props.dispatchSetMap(this.map);

    this.state = {
      tripGeoJSON: {
        type: 'FeatureCollection',
        features: [],
      },
      airportsGeoJSON: {
        type: 'FeatureCollection',
        features: [],
      },
    };

    this.setState({
      tripGeoJSON: buildTripGeoJSON(this.props.trip),
      airportsGeoJSON: buildAirportsGeoJSON(this.props.trip),
    });

    this.map.on('load', () => {
      const nav = new mapboxgl.NavigationControl();

      this.map.addSource('trip', {
        type: 'geojson',
        data: this.state.tripGeoJSON,
      });

      this.map.addSource('airports', {
        type: 'geojson',
        data: this.state.airportsGeoJSON,
      });

      this.map.addSource('airportCoords', {
        type: 'geojson',
        data: airportCoordsTest,
      });

      this.map.addSource('tinLayer', {
        type: 'geojson',
        data: this.props.tinJSON,
      });

      this.map.addLayer({
        id: 'tinLayer',
        source: 'tinLayer',
        type: 'fill',
        paint: {
          'fill-color': {
            property: 'average',
            stops: makeStops(colors, 0, 3000),
          },
          'fill-opacity': 0.6,
          // 'fill-outline-color': 'white',
        },
      });

      this.map.addLayer({
        id: 'airportCoords',
        source: 'airportCoords',
        type: 'circle',
        paint: {
          'circle-radius': 3,
          'circle-stroke-color': colors[colors.length / 2],
          'circle-stroke-width': 0.5,
          'circle-opacity': 0,
          // 'circle-color': colors[colors.length / 2],
        },
      });

      this.map.addLayer({
        id: 'airports',
        source: 'airports',
        type: 'circle',
        paint: {
          'circle-color': 'tomato',
        },
      });
      this.map.addLayer({
        id: 'airport-labels',
        source: 'airports',
        type: 'symbol',
        layout: {
          'text-field': '{city}, {country}',
          'text-anchor': 'bottom',
          'text-padding': 10,
        },
      });
      this.map.addLayer(
        {
          id: 'trip',
          source: 'trip',
          type: 'line',
          paint: {
            'line-width': 3,
            'line-color': 'tomato',
          },
        },
        'trip',
      );

      this.map.addControl(nav, 'top-left');
      this.map.addControl(
        (this.GeoControl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: false,
        })),
        'top-left',
      );

      this.GeoControl.on('geolocate', position => {
        console.log(position);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { departureDate, airportAbbrv, maxPrice } = this.props;
    if (
      nextProps.departureDate !== departureDate ||
      nextProps.airportAbbrv !== airportAbbrv ||
      nextProps.maxPrice !== maxPrice
    ) {
      this.props.dispatchGetPriceTin(
        moment(nextProps.departureDate).format('YYYY-MM-DD'),
        nextProps.airportAbbrv,
        nextProps.maxPrice,
      );
    }

    this.setState(
      {
        tripGeoJSON: buildTripGeoJSON(nextProps.trip),
        airportsGeoJSON: buildAirportsGeoJSON(nextProps.trip),
      },
      () => {
        if (this.state.tripGeoJSON.features.length > 0) {
          const bbox = turf.bbox(this.state.tripGeoJSON);
          this.map.fitBounds(bbox);
        }
        if (this.map.getSource('airports')) {
          this.map.getSource('airports').setData(this.state.airportsGeoJSON);
        }
        if (this.map.getSource('airport-labels')) {
          this.map
            .getSource('airport-labels')
            .setData(this.state.airportsGeoJSON);
        }
        if (this.map.getSource('trip')) {
          this.map.getSource('trip').setData(this.state.tripGeoJSON);
        }
      },
    );
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const { trip } = this.props;
    if (this.map && this.map.getSource('tinLayer'))
      this.map.getSource('tinLayer').setData(this.props.tinJSON);

    // console.log('map tripGeojson:', tripGeoJSON);
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
    };

    return <div style={style} ref={el => (this.mapContainer = el)} />;
  }
}

/**
 * CONTAINER
 */
const mapState = state => ({
  isLoggedIn: !!state.user.id,
  trip: state.userInput.currentTrip,
  airportAbbrv: state.userInput.originAirportAbbrv,
  departureDate: state.userInput.departureDate,
  maxPrice: state.userInput.maxPrice,
  tinJSON: state.userInput.tinJSON,
});

const mapDispatch = dispatch => ({
  handleClick() {
    dispatch(logout());
  },
  dispatchSetMap(map) {
    dispatch(setMap(map));
  },
  dispatchGetPriceTin(date, originAbbrv, maxPrice) {
    dispatch(getPriceTin(date, originAbbrv, maxPrice));
  },
});

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Map));

/**
 * PROP TYPES
 */
Map.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
