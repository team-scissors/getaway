import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logout } from '../store';
import mapboxgl from 'mapbox-gl';
import gridTestData from '/Users/theshuo/Documents/Fullstack/getaway/gridtest.json';

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
mapboxgl.accessToken =
  'pk.eyJ1IjoidGhlc2h1byIsImEiOiJjajgyNXZhY2oyaWc4MzJzMG82dWM3Zm9mIn0._fGWYG5J5f0NwYRbVnByeQ';

class Map extends Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      // style: 'mapbox://styles/theshuo/cj82h754i9kgz2so12kkyyzon',
      // initial position in [lon, lat] format
      center: [-87.623177, 41.881832], // Chicago
      // initial zoom
      zoom: 14,
    });

    this.map.on('load', () => {
      const nav = new mapboxgl.NavigationControl();
      this.map.addControl(nav, 'top-left');
      this.map.addControl(
        (this.GeoControl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: false,
        })),
      );

      this.GeoControl.on('geolocate', pos => {
        console.log(pos);
      });

      this.map.addLayer({
        id: 'points',
        type: 'circle',
        source: {
          type: 'geojson',
          data: gridTestData,
        },
      });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
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
