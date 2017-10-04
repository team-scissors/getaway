import { gql } from 'react-apollo';

export const flightsFromAirportByAbbrv = gql`
  query flightsFromAirportByAbbrv($airportAbbrv: String!) {
    departFrom: airportByAbbrv(abbrv: $airportAbbrv) {
      id
      name
      city
      country
      longitude
      latitude
      flights: flightPricesByFromId {
        nodes {
          price
          arriveAt: airportByToId {
            id
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
