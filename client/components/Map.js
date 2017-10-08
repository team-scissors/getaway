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

  console.log('features:', tripGeoJSON.features);

  tripGeoJSON.features.forEach(feature => {
    var lineDistance = turf.lineDistance(feature, 'kilometers');

    var arc = [];

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i++) {
      var segment = turf.along(feature, i / 1000 * lineDistance, 'kilometers');
      arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    feature.geometry.coordinates = arc;
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
    };

    this.setState({
      tripGeoJSON: buildTripGeoJSON(this.props.trip),
    });

    this.map.on('load', () => {
      const nav = new mapboxgl.NavigationControl();
      this.map.addSource('trip', {
        type: 'geojson',
        data: this.state.tripGeoJSON,
      });

      this.map.addLayer({
        id: 'trip',
        source: 'trip',
        type: 'line',
        paint: {
          'line-width': 2,
          'line-color': '#007cbf',
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
    console.log('nextprops:', nextProps);
    this.setState(
      {
        tripGeoJSON: buildTripGeoJSON(nextProps.trip),
      },
      () => {
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
