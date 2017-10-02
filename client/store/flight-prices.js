// fake flight prices
const flightPriceData = [
      {id: 1, departAt: '2017-10-03', createdAt: '2017-10-02 11:15:11.72-05', fromId: 1, toId: 2},
      {id: 2, departAt: '2017-11-01', createdAt: '2017-10-02 11:15:11.72-05', fromId: 2, toId: 5},
      {id: 3, departAt: '2017-10-21', createdAt: '2017-10-02 11:15:11.72-05', fromId: 3, toId: 7},
    ];

/**
 * ACTION TYPES
 */
const GET_FLIGHT_PRICES = 'GET_FLIGHT_PRICES';

/**
 * INITIAL STATE
 */
const initialState = [];

/**
 * ACTION CREATORS
 */
export const getFlightPrices = (flightPrices) => {
  return { type: GET_FLIGHT_PRICES, flightPrices };
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
