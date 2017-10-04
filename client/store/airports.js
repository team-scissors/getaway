/**
 * ACTION TYPES
 */
const GET_AIRPORTS = 'GET_AIRPORTS';

/**
 * INITIAL STATE
 */
const initialState = [];

/**
 * ACTION CREATORS
 */
export const getAirports = airports => {
  return { type: GET_AIRPORTS, airports };
};

/**
 * THUNK CREATORS
 */
export const fetchAirports = () => dispatch =>
  dispatch(getAirports(airportsData));

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_AIRPORTS:
      return action.airports;
    default:
      return state;
  }
}
