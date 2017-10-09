// REVIEW
// main control-panel AuthForm
// CHOOSE A CONVENTION AND STICK WITH IT
/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './Main';
export { default as Map } from './Map';
export { default as UserHome } from './UserHome';
export { default as SideMenu } from './SideMenu';
export { default as TripMenu } from './TripMenu';
export { default as TopNavFlight } from './TopNavFlight';
export { Login, Signup } from './AuthForm';
export { default as Flights } from './Flights';
export { default as ControlPanel } from './ControlPanel';
export { default as UserPanel } from './UserPanel';
export { default as FlightListPanel } from './FlightListPanel';
export { default as MyTrips } from './MyTrips';
