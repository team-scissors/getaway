/**
 * ACTION TYPES
 */
const SET_AIRPORT = 'SET_AIRPORT';
const CLEAR_AIRPORT_INPUT = 'CLEAR_AIRPORT_INPUT';
const SET_SELECTED_DESTINATION_AIRPORT = "SET_SELECTED_DESTINATION_AIRPORT";
/**
 * INITIAL STATE
 */
const initialState = {
  originAirportAbbrv: 'ORD',
  originAirport: {},
  selectedDestinationAirport: {},
  departureDate: '',
};

/**
 * ACTION CREATORS
 */

export const setAirport = abbrv => {
  return { type: SET_AIRPORT, abbrv };
};

export const clearInputAirport = () => {
  return { type: CLEAR_AIRPORT_INPUT };
};

export const getSelectedDestinationAirport = selectedAirport => {
  return { type: SET_SELECTED_DESTINATION_AIRPORT,selectedAirport };
};

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
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
