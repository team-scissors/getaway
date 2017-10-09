import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';
import mapboxgl from 'mapbox-gl';

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
mapboxgl.accessToken =
  'pk.eyJ1IjoidGhlc2h1byIsImEiOiJjajgyNXZhY2oyaWc4MzJzMG82dWM3Zm9mIn0._fGWYG5J5f0NwYRbVnByeQ';

const primary = '#00D1B2';

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
    });

  trip.forEach(flight => {
    const destination = [flight.dest.longitude, flight.dest.latitude];
    airportsGeoJSON.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: destination,
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
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      // style: 'mapbox://styles/theshuo/cj82h754i9kgz2so12kkyyzon',
      center: [-87.623177, 41.881832], // Chicago
      zoom: 3,
    });

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

      this.map.setPitch(45);

      this.map.addLayer({
        id: 'airports',
        source: 'airports',
        type: 'circle',
      });
      this.map.addLayer({
        id: 'trip',
        source: 'trip',
        type: 'line',
        paint: {
          'line-width': 3,
          'line-color': 'tomato',
        },
      });

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
    this.setState(
      {
        tripGeoJSON: buildTripGeoJSON(nextProps.trip),
        airportsGeoJSON: buildAirportsGeoJSON(nextProps.trip),
      },
      () => {
        if (this.state.tripGeoJSON.features.length > 0) {
          const bbox = turf.bbox(this.state.tripGeoJSON);
          console.log('bbox:', bbox);
          this.map.fitBounds(bbox);
        }
        if (this.map.getSource('airports')) {
          this.map.getSource('airports').setData(this.state.airportsGeoJSON);
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
});

const mapDispatch = dispatch => ({
  handleClick() {
    dispatch(logout());
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
