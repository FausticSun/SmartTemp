/**
  References:
    1. https://blueprintjs.com/docs/#datetime/daterangeinput
    2. https://codesandbox.io/s/105080ojo3
 * */

import React from 'react';
import PropTypes from 'prop-types';
import '../../client/main.css';
import { DateRangeInput, TimePrecision } from '@blueprintjs/datetime';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import Moment from 'moment';

const sampleRateMin = 1;
const sampleRateMax = 300;

const momentFormatter = format => {
  return {
    formatDate: date => Moment(date).format(format),
    parseDate: str => Moment(str, format).toDate(),
    placeholder: `${format} (moment)`
  };
};

const COMMON_FORMATS = {
  SECONDS: momentFormatter('YYYY-MM-DD HH:mm:ss')
};

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleRate: sampleRateMax
    };
    this.dateTimeChangeHandler = this.dateTimeChangeHandler.bind(this);
    this.sampleRateChangeHandler = this.sampleRateChangeHandler.bind(this);
    this.sampleRateMouseUpHandler = this.sampleRateMouseUpHandler.bind(this);
  }

  componentDidMount() {
    const { sampleRate } = this.props;
    this.setState({
      sampleRate
    });
  }

  dateTimeChangeHandler(range) {
    const { dateTimeRange, dateTimeRangeHandler } = this.props;
    const start = range[0];
    const end = range[1];
    if (start && end) {
      dateTimeRangeHandler(range);
    } else {
      dateTimeRangeHandler(dateTimeRange);
    }
  }

  // This merely updates the sample rate text on the UI
  sampleRateChangeHandler(rate) {
    this.setState({
      sampleRate: parseInt(rate, 10)
    });
  }

  // This will propagate the sample rate to parent components
  sampleRateMouseUpHandler() {
    const { sampleRateHandler } = this.props;
    const { sampleRate } = this.state;
    sampleRateHandler(sampleRate);
  }

  render() {
    const { dateTimeRange } = this.props;
    const { sampleRate } = this.state;

    return (
      <div className="control-panel">
        <div className="control-panel__date-time">
          <DateRangeInput
            value={dateTimeRange}
            timePrecision={TimePrecision.SECOND}
            allowSingleDayRange
            shortcuts={false}
            {...COMMON_FORMATS.SECONDS}
            onChange={selectedRange => this.dateTimeChangeHandler(selectedRange)}
          />
        </div>
        <div className="control-panel__sample-rate">
          <input
            type="range"
            min={sampleRateMin}
            max={sampleRateMax}
            value={sampleRate}
            onMouseUp={() => this.sampleRateMouseUpHandler()}
            onChange={e => this.sampleRateChangeHandler(e.target.value)}
          />
          <span>{`${sampleRate} samples`}</span>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  dateTimeRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  sampleRate: PropTypes.number.isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired,
  sampleRateHandler: PropTypes.func.isRequired
};

export default ControlPanel;
