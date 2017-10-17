import {expect} from 'chai';
import { setTripName, clearTripName} from '../../client/store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

const mockAxios = new MockAdapter(axios);
const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe('User-Input Reducer Test', () => {
  const tripName = 'Vacation';

  describe('action creators', () => {
      describe('setTripName', () => {
          it('sets name of the trip', () => {
              const actionDescriptor = setTripName(tripName);
              expect(actionDescriptor).to.be.deep.equal({
                  type: 'SET_TRIP_NAME',
                  tripName: tripName,
              });
          });
      });

      describe('clearTripName', () => {
          it('clears trip name', () => {
              const actionDescriptor = clearTripName();
              expect(actionDescriptor).to.be.deep.equal({
                  type: 'CLEAR_TRIP_NAME',
              });
          });
      });
  });
});
