import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import {
  setAirport,
  clearTrip,
  setMaxPrice,
  addFlightToTrip,
  setDate,
} from '../store/user-input';
import { flightsFromAirportByAbbrv } from './util_helper';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';

const DAY_FORMAT = 'MM/DD/YYYY';
const dayPickerProps = {
  disabledDays: {
    before: new Date(),
  },
  modifiers: {
    monday: { daysOfWeek: [1] },
  },
};

/**
 * COMPONENT
 */
class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxPriceValue: '',
      originValue: '',
      selectedDay: undefined,
      originAirport: {},
      isLoading: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isLoading: nextProps.loading ? 'is-loading' : '',
    });
  }

  handleAddTrip = evt => {
    const flight = {
      origin: { ...this.props.departFrom },
      dest: { ...this.props.selectedDestination },
      date: this.state.selectedDay,
      price: this.props.selectedDestination.price,
    };
    this.props.dispatchAddFlightToTrip(flight);
  };

  handleClearTrip = evt => {
    this.props.dispatchClearTrip();
  };

  handleOriginChange = evt => {
    this.setState({ originValue: evt.target.value }, () => {});
  };

  handleOriginSubmit = evt => {
    evt.preventDefault();
    if (this.state.originValue.length < 3) {
      return;
    }
    this.setState({ originValue: this.state.originValue.toUpperCase() }, () => {
      this.props.dispatchSetAirport(this.state.originValue);
    });
  };

  handleMaxPriceSubmit = evt => {
    evt.preventDefault();
    const price =
      this.state.maxPriceValue <= 0 ? 1000 : this.state.maxPriceValue;
    this.props.dispatchSetMaxPrice(price);
  };

  maxPriceChange = evt => {
    const price = evt.target.value;
    this.setState(
      {
        maxPriceValue: price,
      },
      () => {
        this.props.dispatchSetMaxPrice(this.state.maxPriceValue);
      },
    );
  };

  handleDayChange = date => {
    // this.setState({
    //   selectedDay: day,
    // });
    // console.log
    this.props.dispatchSetDate(date.toDate());
  };

  render() {
    const {
      departureDate,
      airportAbbrv,
      departFrom,
      currentFlight,
      origin,
    } = this.props;

    const formattedDay = departureDate
      ? moment(departureDate).format(DAY_FORMAT)
      : '';

    return (
      <div>
        <nav className="panel">
          <div className="panel-block">
            <div
              className={`control is-medium 
                 has-icons-left`}
            >
              <form onSubmit={this.handleOriginSubmit}>
                <div className="field">
                  <label className="label is-small">Origin Airport</label>
                  <div className="control has-icons-left">
                    <input
                      className="input is-medium"
                      type="text"
                      placeholder={airportAbbrv}
                      value={this.state.originValue}
                      onChange={this.handleOriginChange}
                    />
                    <span className="icon is-medium is-left">
                      <i className="fa fa-search" />
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="panel-block">
            <div className="columns" style={{ width: '100%' }}>
              <div className="column">
                <label className="label is-small">Departure Date</label>
              </div>
              <div className="column">
                <label className="label is-small">Max Price</label>
              </div>
            </div>
          </div>
          <div className="panel-block">
            <div className="field is-grouped">
              <div className="control">
                <DayPickerInput
                  value={formattedDay}
                  onDayChange={this.handleDayChange}
                  className="input is-small calendar"
                  placeholder="Departure Date"
                  dayPickerProps={dayPickerProps}
                />
              </div>
              <div className="field has-addons">
                <div className="control">
                  <a className="button is-static is-small">$</a>
                </div>
                <div className="control">
                  <form onSubmit={this.handleMaxPriceSubmit}>
                    <input
                      className="input is-fullwidth is-small"
                      type="text"
                      placeholder={this.props.maxPrice}
                      value={this.state.maxPriceValue}
                      onChange={this.maxPriceChange}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    currentFlight: state.userInput.currentFlight,
    airportAbbrv: state.userInput.originAirportAbbrv,
    maxPrice: state.userInput.maxPrice,
    departureDate: state.userInput.departureDate,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchSetAirport(input) {
      dispatch(setAirport(input));
    },
    dispatchSetMaxPrice(maxPrice) {
      dispatch(setMaxPrice(maxPrice));
    },
    dispatchAddFlightToTrip(flight) {
      dispatch(addFlightToTrip(flight));
    },
    dispatchSetDate(date) {
      dispatch(setDate(date));
    },
    dispatchClearTrip() {
      dispatch(clearTrip());
    },
  };
};

// See ./utijl_helper/graphQLqueries.js for queries
const ApolloControlPanel = graphql(flightsFromAirportByAbbrv, {
  options: ({ airportAbbrv }) => ({ variables: { airportAbbrv } }),
  props: ({ data: { loading, origin } }) => ({ loading, origin }),
})(ControlPanel);

export default connect(mapState, mapDispatch)(ApolloControlPanel);
