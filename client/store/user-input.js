/**
 * ACTION TYPES
 */
const SET_AIRPORT = 'SET_AIRPORT';
const CLEAR_AIRPORT_INPUT = 'CLEAR_AIRPORT_INPUT';
const SET_MAX_PRICE = 'SET_MAX_PRICE';
const SET_SELECTED_DESTINATION_AIRPORT = 'SET_SELECTED_DESTINATION_AIRPORT';
/**
 * INITIAL STATE
 */
const initialState = {
  originAirportAbbrv: 'ORD',
  originAirport: {},
  selectedDestinationAirport: {},
  departureDate: '',
  maxPrice: 5000,
};

/**
 * ACTION CREATORS
 */

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
