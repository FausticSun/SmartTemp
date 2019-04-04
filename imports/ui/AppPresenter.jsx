import React from 'react';
import AppModel from './AppModel.jsx';

class AppPresenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTimeRange: [new Date('2013-10-02T05:00:00'), new Date('2013-12-03T15:15:00')],
      visibleRooms: [0, 1, 2, 3, 4, 5, 6],
      sampleRate: 300
    };
  }

  updateDateTimeRange(dateTimeRange) {
    this.setState({ dateTimeRange });
  }

  updateVisibleRooms(visibleRooms) {
    this.setState({ visibleRooms });
  }

  updateSampleRate(sampleRate) {
    this.setState({ sampleRate });
  }

  render() {
    const { dateTimeRange, visibleRooms, sampleRate } = this.state;
    return (
      <AppModel
        dateTimeRange={dateTimeRange}
        visibleRooms={visibleRooms}
        sampleRate={sampleRate}
        dateTimeRangeHandler={this.updateDateTimeRange}
        visibleRoomsHandler={this.visibleRoomsHandler}
        sampleRateHandler={this.sampleRateHandler}
      />
    );
  }
}

export default AppPresenter;
