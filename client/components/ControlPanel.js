import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { setAirport } from '../store/user-input';
import { airportByAbbrv } from './util_helper';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';

/**
 * COMPONENT
 */
class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectedDay: new Date(),
      isLoading: '',
    };
    console.log('this.props.setAirportInput:');
    console.log(this.props.setAirportInput);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isLoading: nextProps.loading ? 'is-loading' : '',
    });
  }

  handleChange(evt) {
    this.setState({ value: evt.target.value }, () => {});
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if (this.state.value.length < 3) {
      this.setState({ placeholder: 'Invalid Code' }, () => {});
      return;
    }
    this.props.dispatchSetAirport(this.state.value.toUpperCase());
  }

  handleDayClick = day => {
    this.setState({
      selectedDay: day,
    });
  };

  render() {
    const { departFrom } = this.props;
    console.log(departFrom);
    return (
      <div>
        <nav className="panel">
          <div className="panel-block">
            <div
              className={`control is-small ${this.state
                .isLoading} has-icons-left`}
            >
              <form onSubmit={this.handleSubmit}>
                <input
                  className="input is-small"
                  type="text"
                  placeholder="Enter Origin Airport Code"
                  onChange={this.handleChange}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-search" />
                </span>
              </form>
            </div>
          </div>
          <div className="panel-block">
            <DayPickerInput
              className="input is-small calendar"
              placeholder="Leaving On"
            />
          </div>
          <div className="panel-block">
            {departFrom && (
              <div className="card origin-card">
                <div className="card-content">
                  <strong>Leaving From:</strong>
                </div>
                <div className="card-content">
                  {`${departFrom.abbrv}, ${departFrom.city}`}
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
    // abbrv: 'ORD',
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
