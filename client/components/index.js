/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './Main';
export { default as Map } from './Map';
export { default as UserHome } from './UserHome';
export { default as SideMenu } from './SideMenu';
export { Login, Signup } from './AuthForm';
export { default as Flights } from './flights';
export { default as ControlPanel } from './control-panel';
