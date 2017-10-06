import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import {
  setAirport,
  clearTrip,
  setMaxPrice,
  addFlightToTrip,
} from '../store/user-input';
import { airportByAbbrv } from './util_helper';
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
      maxPriceValue: 0,
      originValue: '',
      selectedDay: undefined,
      originAirport: {},
      isLoading: '',
    };
    console.log('this.props.setAirportInput:');
    console.log(this.props.setAirportInput);
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
    // console.log('flight: ', flight);
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
      this.setState({ placeholder: 'Invalid Code' }, () => {});
      return;
    }
    this.setState({ originValue: this.state.originValue.toUpperCase() }, () => {
      this.props.dispatchSetAirport(this.state.originValue);
    });
  };

  handleMaxPriceSubmit = evt => {
    evt.preventDefault();
    if (this.state.maxPriceValue <= 0) {
      return;
    }
    this.props.dispatchSetMaxPrice(this.state.maxPriceValue);
  };

  maxPriceChange = evt => {
    this.setState({
      maxPriceValue: evt.target.value,
    });
  };

  handleDayChange = day => {
    this.setState({
      selectedDay: day,
    });
  };

  render() {
    const { departFrom, selectedDestination } = this.props;
    const selectedDay = this.state.selectedDay;

    const formattedDay = selectedDay
      ? moment(selectedDay).format(DAY_FORMAT)
      : '';

    return (
      <div>
        <nav className="panel">
          <div className="panel-block">
            <div
              className={`control is-medium ${this.state
                .isLoading} has-icons-left`}
            >
              <form onSubmit={this.handleOriginSubmit}>
                <div className="control">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter Origin Airport Code"
                    value={this.state.originValue}
                    onChange={this.handleOriginChange}
                  />
                  <span className="icon is-medium is-left">
                    <i className="fa fa-search" />
                  </span>
                </div>
              </form>
            </div>
          </div>
          <div className="panel-block">
            <div className="field is-grouped">
              <div className="control">
                <DayPickerInput
                  value={formattedDay}
                  onDayChange={this.handleDayChange}
                  className="input is-small calendar"
                  placeholder="Leaving On Day..."
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
                      className="input is-small"
                      type="text"
                      placeholder="Maximum Price"
                      value={this.state.maxPriceValue}
                      onChange={this.maxPriceChange}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="panel-block">
            {departFrom && (
              <div className="card origin-card">
                <div className="card-content">
                  {/* Listing flights under ${this.props.maxPrice} */}
                  <p />
                  <strong>From:</strong>
                  {` ${departFrom.abbrv}, ${departFrom.city}`}
                  {selectedDestination.abbrv && (
                    <div>
                      <strong>To:</strong>
                      {` ${selectedDestination.abbrv},
                             ${selectedDestination.city}`}
                    </div>
                  )}
                  {selectedDestination.abbrv && formattedDay.length > 0 ? (
                    <p>
                      on
                      <strong>{` ${formattedDay}`} </strong> for
                      {
                        <strong>
                          {` $${Math.trunc(selectedDestination.price)}`}
                        </strong>
                      }
                      <a
                        className="button is-primary"
                        onClick={this.handleAddTrip}
                      >
                        Add To Trip
                      </a>
                    </p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            )}
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
    selectedDestination: state.userInput.selectedDestinationAirport,
    abbrv: state.userInput.originAirportAbbrv,
    maxPrice: state.userInput.maxPrice,
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
    dispatchClearTrip() {
      dispatch(clearTrip());
    },
  };
};

// See ./util_helper/graphQLqueries.js for queries
const ApolloControlPanel = graphql(airportByAbbrv, {
  options: ({ abbrv }) => ({ variables: { airportAbbrv: abbrv } }),
  props: ({ data: { loading, departFrom } }) => ({ loading, departFrom }),
})(ControlPanel);

export default connect(mapState, mapDispatch)(ApolloControlPanel);
// export default connect(mapState, mapDispatch)(ControlPanel);
