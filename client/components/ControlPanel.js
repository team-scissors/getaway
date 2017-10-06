import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { setAirport } from '../store/user-input';
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
      originValue: '',
      selectedDay: undefined,
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

  handleOriginChange = evt => {
    this.setState({ originValue: evt.target.value }, () => {});
  };

  handleOriginSubmit = evt => {
    evt.preventDefault();
    if (this.state.originValue.length < 3) {
      this.setState({ placeholder: 'Invalid Code' }, () => {});
      return;
    }
    this.props.dispatchSetAirport(this.state.originValue.toUpperCase());
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
              className={`control is-small ${this.state
                .isLoading} has-icons-left`}
            >
              <form onSubmit={this.handleOriginSubmit}>
                <div className="control">
                  <input
                    className="input is-small"
                    type="text"
                    placeholder="Enter Origin Airport Code"
                    value={this.state.originValue}
                    onChange={this.handleOriginChange}
                  />
                  <span className="icon is-small is-left">
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
              <div class="field has-addons">
                <div class="control">
                  <a class="button is-static is-small">$</a>
                </div>
                <div className="control">
                  <input
                    className="input is-small"
                    type="text"
                    placeholder="Maximum Price"
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="panel-block">
            <div className="columns panel-columns">
              <div className="column">
                {departFrom && (
                  <div className="card origin-card">
                    <div className="card-content">
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
                          <strong>{`${formattedDay}`} for </strong>
                          {
                            <strong>
                              {`$${Math.trunc(selectedDestination.price)}`}
                            </strong>
                          }
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
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
    selectedDestination: state.userInput.selectedDestinationAirport,
    abbrv: state.userInput.originAirportAbbrv,
  };
};

const mapDispatch = dispatch => {
  return {
    dispatchSetAirport(input) {
      dispatch(setAirport(input));
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
