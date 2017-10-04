/**
 * ACTION TYPES
 */
const SET_AIRPORT = 'SET_AIRPORT';
const CLEAR_AIRPORT_INPUT = 'CLEAR_AIRPORT_INPUT';

/**
 * INITIAL STATE
 */
const initialState = {
  originAirportAbbrv: 'ORD',
  originAirport: {},
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
    default:
      return state;
  }
}
