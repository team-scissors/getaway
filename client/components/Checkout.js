import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { clearTripName, clearTrip, createTrip } from '../store';
/**
 * COMPONENT
 */
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.StripeHandler = StripeCheckout.configure({
      key: 'pk_test_9my2xxrckuwRluIePEZcdRbt',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: (token) => {
        const message = `Purchased ${this.props.currentTripName} trip successfully`;
        const newTrip = {
          name: this.props.currentTripName,
          userId: this.props.userId,
        };
        const flightIds = this.props.trip.length > 0
          ? this.props.trip.map(trip => {
            return trip.id;
          })
          : [];

        this.props.dispatchSaveTrip(newTrip, flightIds, message);
        this.props.dispatchClearTripName();
        this.props.dispatchClearTrip();
        this.props.history.push('/');
      },
    });
  }

  render() {
    const { trip, currentTripName } = this.props;

    const totalPrice =
      trip.length > 0
        ? trip.reduce((a, b) => {
          return a + b.price;
        }, 0)
        : 0;

    return (
      <section className="section">
          <h4 className="has-text-centered title is-4">Trip Name {trip && `: ${currentTripName}`}</h4>
        {trip.length > 0 ? (
          <div>
            <div className="card trip-list">
              <div className="panel">
                {
                  trip.map((flight, idx) => {
                    return (
                      <div className="panel-block" key={idx}>
                        <div className="level flight-list-item">
                          <div className="level-item has-text-centered">
                            <div>
                              <p className="heading">From</p>
                              <p className="title is-6">{flight.origin.abbrv}</p>
                            </div>
                          </div>
                          <div className="level-item has-text-centered">
                            <div>
                              <p className="heading">To</p>
                              <p className="title is-6">{flight.dest.abbrv}</p>
                            </div>
                          </div>
                          <div className="level-item has-text-centered">
                            <div>
                              <p className="heading">Date</p>
                              <p className="title is-6">{flight.departAt}</p>
                            </div>
                          </div>
                          <div className="level-item has-text-centered">
                            <div>
                              <p className="heading">Price</p>
                              <p className="title is-6">
                                ${Math.trunc(flight.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
            <div className="level purchase">
              <div className="title level-left is-6">Total Cost: {`$${Math.trunc(totalPrice)}`}</div>
              <button className="button is-primary level-right" onClick={()=> 
              this.StripeHandler.open({
                name: 'getAway!',description: currentTripName, amount: Math.trunc(totalPrice)*100
                }) }>Purchase</button>
            </div>
          </div>
        ) : (
            ''
          )}
      </section>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    userId: state.user.id,
    trip: state.userInput.currentTrip,
    currentTripName: state.userInput.currentTripName,

  };
};

const mapDispatch = dispatch => {
  return {
    dispatchClearTripName() {
      dispatch(clearTripName());
    },
    dispatchClearTrip() {
      dispatch(clearTrip());
    },
    dispatchSaveTrip: (newTrip, flightIds, message) => {
      dispatch(createTrip(newTrip, flightIds, message));
    },
  };
};

export default connect(mapState, mapDispatch)(Checkout);
