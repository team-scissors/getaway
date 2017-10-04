/**
 * ACTION TYPES
 */
const SET_AIRPORT_INPUT = 'SET_AIRPORT_INPUT';
const CLEAR_AIRPORT_INPUT = 'CLEAR_AIRPORT_INPUT';

/**
 * INITIAL STATE
 */
const initialState = '';

/**
 * ACTION CREATORS
 */

export const setAirportInput = (userInput) => {
  return { type: SET_AIRPORT_INPUT, userInput };
};

export const clearInputAirport = () => {
  return { type: CLEAR_AIRPORT_INPUT };
};

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AIRPORT_INPUT:
      return action.userInput;
    case CLEAR_AIRPORT_INPUT:
      return initialState;
    default:
      return state;
  }
}
