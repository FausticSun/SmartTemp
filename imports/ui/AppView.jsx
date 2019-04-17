import React from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { TimeRange } from 'pondjs';
import Rooms from './Rooms.jsx';
import Chart from './Chart.jsx';
import ControlPanel from './ControlPanel.jsx';
import '../../client/main.css';
import { AllRooms } from '../constants';

class AppView extends React.Component {
  constructor(props) {
    super(props);
    const { temperatures } = props;
    this.state = {
      temperatures
    };
  }

  static getDerivedStateFromProps(props) {
    const { temperatures } = props;
    if (temperatures) {
      return { temperatures };
    }
    return null;
  }

  render() {
    const {
      loading,
      visibleRoomsHandler,
      visibleRooms,
      dateTimeRange,
      sampleRate,
      dateTimeRangeHandler,
      sampleRateHandler
    } = this.props;
    const { temperatures } = this.state;

    return (
      <div className="app-view">
        <ControlPanel
          dateTimeRange={dateTimeRange}
          sampleRate={sampleRate}
          dateTimeRangeHandler={dateTimeRangeHandler}
          sampleRateHandler={sampleRateHandler}
        />
        <LoadingOverlay active={loading} spinner fadeSpeed={100}>
          <Chart
            temperatures={temperatures}
            visibleRooms={visibleRooms}
            dateTimeRange={dateTimeRange}
            dateTimeRangeHandler={dateTimeRangeHandler}
          />
        </LoadingOverlay>
        <Rooms
          temperatures={temperatures}
          visibleRooms={visibleRooms}
          visibleRoomsHandler={visibleRoomsHandler}
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
  visibleRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  dateTimeRange: PropTypes.instanceOf(TimeRange).isRequired,
  sampleRate: PropTypes.number.isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired,
  visibleRoomsHandler: PropTypes.func.isRequired,
  sampleRateHandler: PropTypes.func.isRequired
};

AppView.defaultProps = {
  temperatures: AllRooms.map(x => ({
    _id: x,
    points: []
  }))
};

export default AppView;
