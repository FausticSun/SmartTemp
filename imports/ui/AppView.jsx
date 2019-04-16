import React from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import Rooms from './Rooms.jsx';
import Chart from './Chart.jsx';
import ControlPanel from './ControlPanel.jsx';
import '../../client/main.css';

const AppView = props => {
  const {
    temperatures,
    loading,
    visibleRoomsHandler,
    visibleRooms,
    dateTimeRange,
    sampleRate,
    dateTimeRangeHandler,
    sampleRateHandler
  } = props;

  return (
    <div className="app-view">
      <LoadingOverlay active={loading} spinner fadeSpeed={100} />
      <ControlPanel
        dateTimeRange={dateTimeRange}
        sampleRate={sampleRate}
        dateTimeRangeHandler={dateTimeRangeHandler}
        sampleRateHandler={sampleRateHandler}
      />
      <Chart
        temperatures={temperatures}
        dateTimeRange={dateTimeRange}
        dateTimeRangeHandler={dateTimeRangeHandler}
      />
      <Rooms
        temperatures={temperatures}
        visibleRooms={visibleRooms}
        visibleRoomsHandler={visibleRoomsHandler}
        dateTimeRange={dateTimeRange}
        loading={loading}
      />
    </div>
  );
};

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
  ).isRequired,
  visibleRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  dateTimeRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  sampleRate: PropTypes.number.isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired,
  visibleRoomsHandler: PropTypes.func.isRequired,
  sampleRateHandler: PropTypes.func.isRequired
};

export default AppView;
