import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';
import { airportToGeoJson } from './util_helper';

const GeoJson = props => {
  console.log('props');
  console.log(props);
  const airportAsGeoJson = !props.loading
    ? airportToGeoJson(props.data.airportById)
    : {};
  console.log('airportAsGeoJson:');
  console.log(airportAsGeoJson);
  return (
    <span style={{display: 'none'}}>{props.toString()}</span>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return { };
};

const mapDispatch = dispatch => {
  return { };
};

const ApolloGeoJson = graphql(gql`
  query {
    airportById(id: 51) {
      id
      name
      city
      country
      abbrv
      latitude
      longitude
    }
  }
  `)(GeoJson);

export default withRouter(connect(mapState, mapDispatch)(ApolloGeoJson));
