/**
 * ACTION TYPES
 */
const GET_INPUT_AIRPORT = 'GET_INPUT_AIRPORT';

/**
 * INITIAL STATE
 */
const initialState = '';

/**
 * ACTION CREATORS
 */
export const getFlightPrices = (flightPrices) => {
  return { type: GET_INPUT_AIRPORT, flightPrices };
};

/**
 * THUNK CREATORS
 */
export const fetchFlightPrices = () => (dispatch) => dispatch(getFlightPrices(flightPriceData));

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_FLIGHT_PRICES:
      return action.flightPrices;
    default:
      return state;
  }
}
