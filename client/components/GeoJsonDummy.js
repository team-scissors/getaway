import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';

const GeoJson = props => {

  console.log('this.props');
  console.log(this.props);
  return (
    <div>{this.props}</div>
  );
};
