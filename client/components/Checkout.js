import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

/**
 * COMPONENT
 */
class Checkout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {trip, tripName} = this.props;

    return (
      <section className="section">
        {
          tripName && <h2 className="has-text-centered">Trip {tripName} Details</h2>
        }
        {trip.length > 0 ? (
          <div className="card trip-list">
            <div className="panel">
              {trip.map((flight, idx) => {
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
              })}
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
    trip: state.userInput.currentTrip,
    tripName: state.userInput.currentTripName,
  };
};

const mapDispatch = dispatch => {
  return {

  };
};

export default connect(mapState, mapDispatch)(Checkout);
