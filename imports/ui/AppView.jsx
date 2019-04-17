import React from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { TimeRange } from 'pondjs';
import Rooms from './Rooms.jsx';
import Chart from './Chart.jsx';
import ControlPanel from './ControlPanel.jsx';
import '../../client/main.css';
import { FullTimeRange, AllRooms } from '../constants';

class AppView extends React.Component {
  constructor(props) {
    super(props);
    const { temperatures } = props;
    this.state = {
      dateTimeRange: new TimeRange(FullTimeRange.begin(), FullTimeRange.end()),
      visibleRooms: [...AllRooms],
      temperatures
    };
    this.updateDateTimeRange = this.updateDateTimeRange.bind(this);
    this.updateVisibleRooms = this.updateVisibleRooms.bind(this);
  }

  static getDerivedStateFromProps(props) {
    const { temperatures } = props;
    if (temperatures && temperatures.length === 7) {
      return { temperatures };
    }
    return null;
  }

  updateDateTimeRange(dateTimeRange) {
    const { durationHandler } = this.props;
    this.setState({ dateTimeRange });
    durationHandler(dateTimeRange.duration());
  }

  updateVisibleRooms(visibleRooms) {
    this.setState({ visibleRooms });
  }

  render() {
    const { loading, sampleRateHandler, sampleRate } = this.props;
    const { dateTimeRange, visibleRooms, temperatures } = this.state;

    return (
      <div className="app-view">
        <ControlPanel
          dateTimeRange={dateTimeRange}
          sampleRate={sampleRate}
          dateTimeRangeHandler={this.updateDateTimeRange}
          sampleRateHandler={sampleRateHandler}
        />
        <LoadingOverlay active={loading} spinner fadeSpeed={100}>
          <Chart
            temperatures={temperatures}
            visibleRooms={visibleRooms}
            dateTimeRange={dateTimeRange}
            dateTimeRangeHandler={this.updateDateTimeRange}
          />
        </LoadingOverlay>
        <Rooms
          temperatures={temperatures}
          visibleRooms={visibleRooms}
          visibleRoomsHandler={this.updateVisibleRooms}
          dateTimeRange={dateTimeRange}
          loading={loading}
        />
      </div>
    );
  }
}

AppView.propTypes = {
  loading: PropTypes.bool.isRequired,
  temperatures: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      points: PropTypes.arrayOf(
        PropTypes.shape({
          timestamp: PropTypes.instanceOf(Date).isRequired,
          temperature: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ),
  sampleRate: PropTypes.number.isRequired,
  sampleRateHandler: PropTypes.func.isRequired,
  durationHandler: PropTypes.func.isRequired
};

AppView.defaultProps = {
  temperatures: AllRooms.map(x => ({
    _id: x,
    points: []
  }))
};

export default AppView;
