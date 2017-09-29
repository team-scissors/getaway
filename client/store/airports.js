//import history from '../history';

// fake airports
const airportsData = [
      {"airport_id":"6891","name":"GMA","city":"Greencastle","country":"United States","latitude":"39.6335556","longitude":"-86.8138056","price": "8000"},
      {"airport_id":"6890","name":"DMA","city":"Dowagiac","country":"United States","latitude":"41.9929342","longitude":"-86.1280125","price": "1000"},
      {"airport_id":"6889","name":"CMA","city":"Cambridge","country":"United States","latitude":"39.9750278","longitude":"-81.5775833","price": "400"},
      {"airport_id":"6885","name":"DCCA","city":"Sturgeon Bay","country":"United States","latitude":"44.8436667","longitude":"-87.4215556","price": "10000"},
      {"airport_id":"6884","name":"SAA","city":"Stewartstown","country":"United States","latitude":"39.7948244","longitude":"-76.6471914","price": "4000"},
      {"airport_id":"6883","name":"EORA","city":"Pendleton","country":"United States","iaco":"KPDT","latitude":"45.695","longitude":"-118.841389","price": "100"},
      {"airport_id":"6882","name":"TA","city":"Tyonek","country":"United States","latitude":"61.076667","longitude":"-151.138056","price": "800"},
    ];


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
export const getAirports = (airports) => {
  return { type: GET_AIRPORTS, airports };
};

/**
 * THUNK CREATORS
 */
export const fetchAirports = () => (dispatch) => dispatch(getAirports(airportsData));

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
