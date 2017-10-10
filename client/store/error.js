/**
 * ACTION TYPES
 */
const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';

/**
 * INITIAL STATE
 */
const error = null;

/**
 * ACTION CREATORS
 */
export const setError= (err) => ({ type: SET_ERROR, err });
export const clearError= () => ({ type: CLEAR_ERROR });

/**
 * REDUCER
 */
export default function(state = error, action) {
  switch (action.type) {
    case SET_ERROR:
      return action.err;
    case CLEAR_ERROR:
      return error;
    default:
      return state;
  }
}
