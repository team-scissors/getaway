import { gql } from 'react-apollo';

// REVIEW: nice
export const flightsFromAirportByAbbrv = gql`
  query flightsFromAirportByAbbrv($airportAbbrv: String!) {
    origin: airportByAbbrv(abbrv: $airportAbbrv) {
      id
      name
      abbrv
      city
      country
      continent
      longitude
      latitude
      flights: flightsByFromId {
        nodes {
          id
          price
          departAt
          dest: airportByToId {
            id
            abbrv
            name
            city
            continent
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
      continent
      longitude
      latitude
    }
  }
`;

/*
Query arguments should look something like this:
{
  "input": {
    "trip": {
      "name": "yet another trip",
      "createdAt": "2017-10-07",
      "updatedAt": "2017-10-07",
      "userId": 1
    }
  }
}
*/
export const createTrip = gql`
  mutation createTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      trip {
        id
        name
        userId
      }
    }
  }
`;
