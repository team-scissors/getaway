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
    const {trip} = this.props;

    return (
      <section className="section">
        <h2 className="has-text-centered">Trip Details</h2>
        {trip.length > 0 ? (
          <div className="card trip-list">
            <nav className="panel">
              {' '}
              {trip.map((flight, idx) => {
                return (
                  <a className="panel-block" key={idx}>
                    <nav className="level flight-list-item">
                      <div className="level-item has-text-centered">
                        <div onClick={() => this.handleFlyTo(flight.origin)}>
                          <p className="heading">From</p>
                          <p className="title is-6">{flight.origin.abbrv}</p>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div onClick={() => this.handleFlyTo(flight.dest)}>
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
                    </nav>
                  </a>
                );
              })}
            </nav>
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
  };
};

const mapDispatch = dispatch => {
  return {

  };
};

export default connect(mapState, mapDispatch)(Checkout);
