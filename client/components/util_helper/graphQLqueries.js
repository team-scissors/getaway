import { gql } from 'react-apollo';

export const flightsFromAirportByAbbrv = gql`
  query flightsFromAirportByAbbrv($airportAbbrv: String!) {
    origin: airportByAbbrv(abbrv: $airportAbbrv) {
      id
      name
      abbrv
      city
      country
      longitude
      latitude
      flights: flightsByFromId {
        nodes {
          price
          departAt
          dest: airportByToId {
            id
            abbrv
            name
            city
            country
            longitude
            latitude
          }
        }
      }
    }
  }
`;

export const airportByAbbrv = gql`
  query airportByAbbrv($airportAbbrv: String!) {
    departFrom: airportByAbbrv(abbrv: $airportAbbrv) {
      id
      name
      abbrv
      city
      country
      longitude
      latitude
    }
  }
`;
