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
    .then(trips => {
      dispatch(getTrips(trips));
    })
    .catch(err => console.log(err));
  };
};

export const createTrip = newTrip => {
  return dispatch => {
    return axios.post(`/api/trips/`, newTrip)
    .then(trip => {
      dispatch(addTripToTrips(trip));
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
