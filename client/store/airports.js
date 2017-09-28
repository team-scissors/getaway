//import history from '../history';

// fake airports
const airportsData = [
      {"airport_id":"6891","city":"Greencastle","country":"United States","latitude":"39.6335556","longitude":"-86.8138056"},
      {"airport_id":"6890","name":"Dowagiac Municipal Airport","city":"Dowagiac","country":"United States","latitude":"41.9929342","longitude":"-86.1280125"},
      {"airport_id":"6889","name":"Cambridge Municipal Airport","city":"Cambridge","country":"United States","latitude":"39.9750278","longitude":"-81.5775833"},
      {"airport_id":"6885","name":"Door County Cherryland Airport","city":"Sturgeon Bay","country":"United States","latitude":"44.8436667","longitude":"-87.4215556"},
      {"airport_id":"6884","name":"Shoestring Aviation Airfield","city":"Stewartstown","country":"United States","latitude":"39.7948244","longitude":"-76.6471914"},
      {"airport_id":"6883","name":"Eastern Oregon Regional Airport","city":"Pendleton","country":"United States","iaco":"KPDT","latitude":"45.695","longitude":"-118.841389"},
      {"airport_id":"6882","name":"Tyonek Airport","city":"Tyonek","country":"United States","latitude":"61.076667","longitude":"-151.138056"},
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
export const fetchAirports = () => airportsData;

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
