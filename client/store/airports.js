
// fake airports
const airportsData = [
      {id:1,"name":"GMA","city":"Greencastle","country":"United States","latitude":"39.6335556","longitude":"-86.8138056","price": "4000"},
      {id:2,"name":"DMA","city":"Dowagiac","country":"United States","latitude":"41.9929342","longitude":"-86.1280125","price": "900"},
      {id:3,"name":"CMA","city":"Cambridge","country":"United States","latitude":"39.9750278","longitude":"-81.5775833","price": "500"},
      {id:4,"name":"DCCA","city":"Sturgeon Bay","country":"United States","latitude":"44.8436667","longitude":"-87.4215556","price": "300"},
      {id:5,"name":"SAA","city":"Stewartstown","country":"United States","latitude":"39.7948244","longitude":"-76.6471914","price": "500"},
      {id:6,"name":"EORA","city":"Pendleton","country":"United States","iaco":"KPDT","latitude":"45.695","longitude":"-118.841389","price": "100"},
      {id:7,"name":"TA","city":"Tyonek","country":"United States","latitude":"61.076667","longitude":"-151.138056","price": "600"},
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
