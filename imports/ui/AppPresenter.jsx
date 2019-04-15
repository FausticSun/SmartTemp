import React from 'react';
import { ReactiveVar } from 'meteor/reactive-var';
import AppModel from './AppModel.jsx';

class AppPresenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTimeRange: new ReactiveVar([
        new Date('2013-10-02T05:00:00'),
        new Date('2013-12-03T15:15:00')
      ]),
      visibleRooms: new ReactiveVar([0, 1, 2, 3, 4, 5, 6]),
      sampleRate: new ReactiveVar(300)
    };
    this.updateDateTimeRange = this.updateDateTimeRange.bind(this);
    this.updateVisibleRooms = this.updateVisibleRooms.bind(this);
    this.updateSampleRate = this.updateSampleRate.bind(this);
  }

  updateDateTimeRange(dateTimeRange) {
    this.state.dateTimeRange.set(dateTimeRange);
  }

  updateVisibleRooms(visibleRooms) {
    this.state.visibleRooms.set(visibleRooms);
  }

  updateSampleRate(sampleRate) {
    this.state.sampleRate.set(sampleRate);
  }

  render() {
    const { dateTimeRange, visibleRooms, sampleRate } = this.state;
    return (
      <AppModel
        dateTimeRange={dateTimeRange}
        visibleRooms={visibleRooms}
        sampleRate={sampleRate}
        dateTimeRangeHandler={this.updateDateTimeRange}
        visibleRoomsHandler={this.updateVisibleRooms}
        sampleRateHandler={this.updateSampleRate}
      />
    );
  }
}

export default AppPresenter;
