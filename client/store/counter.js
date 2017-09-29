/**
 * ACTION TYPES
 */
const GET_COUNTER = 'GET_COUNTER';
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

/**
 * INITIAL STATE
 */
const initialCounter = 0;

/**
 * ACTION CREATORS
 */

export const incrementCounter = () => {
 return { type: INCREMENT_COUNTER, data: 1 };
};

export const decrementCounter = () => {
  return { type: DECREMENT_COUNTER, data: -1 };
};

/**
 * THUNK CREATORS
 */
// None needed

/**
 * REDUCER
 */
export default function(counter = initialCounter, action) {
  switch (action.type) {
    case GET_COUNTER:
      return counter;
    case INCREMENT_COUNTER:
      return counter + action.data;
    case DECREMENT_COUNTER:
      return counter + action.data;
    default:
      return counter;
  }
}
