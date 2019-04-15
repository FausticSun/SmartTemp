import React from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import Rooms from './Rooms.jsx';
import '../../client/main.css';

const AppView = props => {
  const { temperatures, loading, visibleRoomsHandler, visibleRooms } = props;
  const avgTempList = temperatures.map(x => (
    <React.Fragment key={x._id}>
      <dt>{x._id}</dt>
      <dd>{x.average}</dd>
    </React.Fragment>
  ));

  return (
    <React.Fragment>
      <LoadingOverlay active={loading} spinner fadeSpeed={100} />
      <dl>{avgTempList}</dl>
      <Rooms
        temperatures={temperatures}
        visibleRooms={visibleRooms}
        visibleRoomsHandler={visibleRoomsHandler}
      />
    </React.Fragment>
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
      ).isRequired,
      average: PropTypes.number.isRequired
    })
  ).isRequired,
  visibleRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired,
  visibleRoomsHandler: PropTypes.func.isRequired,
  sampleRateHandler: PropTypes.func.isRequired
};

export default AppView;
