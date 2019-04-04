import React from 'react';
import PropTypes from 'prop-types';

const AppView = props => {
  const { temperatures } = props;
  const avgTempList = temperatures.map(x => (
    <React.Fragment key={x._id /* eslint-disable-line no-underscore-dangle */}>
      <dt>{x._id /* eslint-disable-line no-underscore-dangle */}</dt>
      <dd>{x.average}</dd>
    </React.Fragment>
  ));

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <dl>{avgTempList}</dl>
    </div>
  );
};

AppView.propTypes = {
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
  dateTimeRangeHandler: PropTypes.func.isRequired,
  visibleRoomsHandler: PropTypes.func.isRequired,
  sampleRateHandler: PropTypes.func.isRequired
};

export default AppView;
