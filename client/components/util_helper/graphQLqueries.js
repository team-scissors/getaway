import { gql } from 'react-apollo';

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


// Finish this. TODO
export const flightsFromAirportByAbbrvAndDate = gql`
query flightsFromAirportByAbbrvAndDate($abbrv: String = "ORD", $date: Date = "02-01-2018") {
origin: airportByAbbrv(abbrv: $abbrv) {
    id
    name
    abbrv
    city
    country
    continent
    longitude
    latitude
    flights: flightsByFromId(condition: {
      departAt: $date
    }) {
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

/* Gets the trips for a user by their id
Query arguments should look something like this:
{
  "id": 1
}
*/
export const tripsByUserId = gql`
  query tripsByUserId($id: Int = 0) {
    allTrips(condition: {
      userId: $id
    }) {
      trips: nodes {
        id
        name
        tripFlightsByTripId {
          nodes {
            flightByFlightId {
              id
              departAt
              price
              origin: airportByFromId {
                id
                name
                abbrv
                city
                country
                continent
                longitude
                latitude
              }
              dest: airportByToId {
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
