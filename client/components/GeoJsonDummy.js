import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';

const GeoJson = props => {
  console.log('props');
  console.log(props);
  return (
    <div>{props.toString()}</div>
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
      city
      country
      abbrv
      latitude
      longitude
    }
  }
  `)(GeoJson);

export default withRouter(connect(mapState, mapDispatch)(ApolloGeoJson));
