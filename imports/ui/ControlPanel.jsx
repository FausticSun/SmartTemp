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
import { TimeRange } from 'pondjs';
import { FullTimeRange } from '../constants';

const sampleRateMin = 8;
const sampleRateMax = 2048;
const samepleRateDefault = 2048;

const momentFormatter = format => {
  return {
    formatDate: date => Moment(date).format(format),
    parseDate: str => Moment(str, format).toDate(),
    placeholder: `${format} (moment)`
  };
};

const COMMON_FORMATS = {
  SECONDS: momentFormatter('YYYY-MM-DD HH:mm:ss'),
  MINUTES: momentFormatter('YYYY-MM-DD HH:mm')
};

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleRate: samepleRateDefault
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
    const { dateTimeRangeHandler } = this.props;
    const start = range[0];
    const end = range[1];
    if (start && end) {
      dateTimeRangeHandler(new TimeRange(range[0], range[1]));
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
          <span>Date Time Range</span>
          <DateRangeInput
            value={[dateTimeRange.begin(), dateTimeRange.end()]}
            minDate={FullTimeRange.begin()}
            maxDate={FullTimeRange.end()}
            timePrecision={TimePrecision.MINUTE}
            timePickerProps={{ showArrowButtons: true }}
            allowSingleDayRange
            closeOnSelection={false}
            shortcuts={false}
            {...COMMON_FORMATS.MINUTES}
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
  dateTimeRange: PropTypes.instanceOf(TimeRange).isRequired,
  sampleRate: PropTypes.number.isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired,
  sampleRateHandler: PropTypes.func.isRequired
};

export default ControlPanel;
