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
const SET_DATE = 'SET_DATE';
const SET_MAP = 'SET_MAP';
const SET_TRIP = 'SET_TRIP';
/**
 * INITIAL STATE
 */
const initialState = {
  map: {},
  currentTrip: [],
  currentTripName: '',
  originAirportAbbrv: 'ORD',
  originAirport: {},
  currentFlight: {},
  departureDate: new Date(2018, 1, 1),
  maxPrice: 1000,
};

/**
 * ACTION CREATORS
 */

export const addFlightToTrip = flight => {
  return { type: ADD_FLIGHT_TO_TRIP, flight };
};

export const setMap = map => {
  return { type: SET_MAP, map };
};

export const setDate = date => {
  return { type: SET_DATE, date };
};

export const clearTrip = () => {
  return { type: CLEAR_TRIP };
};

export const setTrip = trip => {
  return { type: SET_TRIP, trip };
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
    case SET_DATE:
      return {
        ...state,
        departureDate: action.date,
      };
    case SET_MAP:
      return {
        ...state,
        map: action.map,
      };
    case SET_TRIP:
      return {
        ...state,
        currentTrip: action.trip,
      };
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
