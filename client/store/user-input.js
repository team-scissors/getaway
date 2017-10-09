/**
 * ACTION TYPES
 */
const SET_AIRPORT = 'SET_AIRPORT';
const CLEAR_AIRPORT_INPUT = 'CLEAR_AIRPORT_INPUT';
const CLEAR_TRIP = 'CLEAR_TRIP';
const SET_TRIP_NAME = 'SET_TRIP_NAME';
const SET_MAX_PRICE = 'SET_MAX_PRICE';
const ADD_FLIGHT_TO_TRIP = 'ADD_FLIGHT_TO_TRIP';
const SET_CURRENT_FLIGHT = 'SET_CURRENT_FLIGHT';
/**
 * INITIAL STATE
 */
const initialState = {
  currentTrip: [],
  currentTripName: '',
  originAirportAbbrv: 'ORD',
  originAirport: {},
  currentFlight: {},
  maxPrice: 500,
};

/**
 * ACTION CREATORS
 */

export const addFlightToTrip = flight => {
  return { type: ADD_FLIGHT_TO_TRIP, flight };
};

export const clearTrip = () => {
  return { type: CLEAR_TRIP };
};

export const setTripName = tripName => {
  return { type: SET_TRIP_NAME, tripName };
};

export const setAirport = abbrv => {
  return { type: SET_AIRPORT, abbrv };
};

export const setMaxPrice = maxPrice => {
  return { type: SET_MAX_PRICE, maxPrice };
};

export const clearInputAirport = () => {
  return { type: CLEAR_AIRPORT_INPUT };
};

export const setCurrentFlight = selectedAirport => {
  return { type: SET_CURRENT_FLIGHT, selectedAirport };
};

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case CLEAR_TRIP:
      return {
        ...state,
        currentTrip: [],
      };
    case ADD_FLIGHT_TO_TRIP:
      return {
        ...state,
        currentTrip: [...state.currentTrip, action.flight],
      };
    case SET_TRIP_NAME:
      return {
        ...state,
        currentTripName: action.tripName,
      };
    case SET_MAX_PRICE:
      return {
        ...state,
        maxPrice: action.maxPrice,
      };
    case SET_AIRPORT:
      return {
        ...state,
        currentFlight: {},
        originAirportAbbrv: action.abbrv,
      };
    case CLEAR_AIRPORT_INPUT:
      return initialState;
    case SET_CURRENT_FLIGHT:
      return { ...state, currentFlight: action.selectedAirport };
    default:
      return state;
  }
}
