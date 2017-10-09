import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_TRIPS = 'GET_TRIPS';
const CLEAR_TRIPS = 'CLEAR_TRIPS';
const ADD_TRIP_TO_TRIPS = 'ADD_TRIP_TO_TRIPS';

/**
 * INITIAL STATE
 */
const initialState = [];

/**
 * ACTION CREATORS
 */
export const getTrips = trips => {
  return { type: GET_TRIPS, trips };
};

export const clearTrips = () => {
  return { type: CLEAR_TRIPS };
};

export const addTripToTrips = trip => {
  return { type: ADD_TRIP_TO_TRIPS, trip };
};

/**
 * THUNK CREATORS
 */
export const fetchTrips = userId => {
  return dispatch => {
    if (!userId) return;
    return axios.get(`/api/trips/user/${userId}`)
    .then(res => res.data)
    .then(trips => {
      console.log('trips:');
      console.log(trips);
      dispatch(getTrips(trips));
    })
    .catch(err => console.log(err));
  };
};

export const createTrip = (newTrip, flightIds) => {
  return dispatch => {
    return axios.post(`/api/trips/`, newTrip)
    .then(res => res.data)
    .then(trip => {
      return axios.post(`/api/trips/${trip.id}`, flightIds);
    })
    .then(() => {
      dispatch(fetchTrips(newTrip.userId));
    })
    .catch(err => console.log(err));
  };
};

export const updateTripNewFlight = (tripId, flightId) => {
  return dispatch => {
    return axios.put(`/api/trips/${tripId}/${flightId}`)
    .then(res => {
      // Do something with the store here. TODO: make an action creator
    })
    .catch(err => console.log(err));
  };
};

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TRIPS:
      return action.trips;
    case CLEAR_TRIPS:
      return initialState;
    case ADD_TRIP_TO_TRIPS:
      return state.concat(action.trip);
    default:
      return state;
  }
}
