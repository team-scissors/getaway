/**
 * ACTION TYPES
 */
const SET_AIRPORT = 'SET_AIRPORT';
const CLEAR_AIRPORT_INPUT = 'CLEAR_AIRPORT_INPUT';
const CLEAR_TRIP = 'CLEAR_TRIP';
const SET_MAX_PRICE = 'SET_MAX_PRICE';
const ADD_FLIGHT_TO_TRIP = 'ADD_FLIGHT_TO_TRIP';
const SET_SELECTED_DESTINATION_AIRPORT = 'SET_SELECTED_DESTINATION_AIRPORT';
const SET_DATE = 'SET_DATE';
/**
 * INITIAL STATE
 */
const initialState = {
  currentTrip: [],
  originAirportAbbrv: 'ORD',
  originAirport: {},
  selectedDestinationAirport: {},
  departureDate: new Date(),
  maxPrice: 1000,
};

/**
 * ACTION CREATORS
 */

export const addFlightToTrip = flight => {
  return { type: ADD_FLIGHT_TO_TRIP, flight };
};

export const setDate = date => {
  return { type: SET_DATE, date };
};

export const clearTrip = () => {
  return { type: CLEAR_TRIP };
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

export const getSelectedDestinationAirport = selectedAirport => {
  return { type: SET_SELECTED_DESTINATION_AIRPORT, selectedAirport };
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
    case SET_MAX_PRICE:
      return {
        ...state,
        maxPrice: action.maxPrice,
      };
    case SET_AIRPORT:
      return {
        ...state,
        originAirportAbbrv: action.abbrv,
      };
    case CLEAR_AIRPORT_INPUT:
      return initialState;
    case SET_SELECTED_DESTINATION_AIRPORT:
      return { ...state, selectedDestinationAirport: action.selectedAirport };
    default:
      return state;
  }
}
