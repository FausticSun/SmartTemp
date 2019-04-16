import React from 'react';
import { ReactiveVar } from 'meteor/reactive-var';
import { debounce } from 'underscore';
import { TimeRange } from 'pondjs';
import AppModel from './AppModel.jsx';

class AppPresenter extends React.Component {
  constructor(props) {
    super(props);
    const dateTimeRange = [new Date('2013-10-02T05:00:00'), new Date('2013-12-03T15:15:00')];
    const pondTimeRange = new TimeRange(dateTimeRange[0], dateTimeRange[1]);
    this.state = {
      dateTimeRange,
      visibleRooms: [0, 1, 2, 3, 4, 5, 6],
      sampleRate: new ReactiveVar(300),
      duration: new ReactiveVar(pondTimeRange.duration())
    };
    this.updateDateTimeRange = this.updateDateTimeRange.bind(this);
    this.updateVisibleRooms = debounce(this.updateVisibleRooms, 100).bind(this);
    this.updateSampleRate = debounce(this.updateSampleRate, 100).bind(this);
  }

  updateDateTimeRange(dateTimeRange) {
    this.setState({ dateTimeRange });
    const { duration } = this.state;
    const pondTimeRange = new TimeRange(dateTimeRange[0], dateTimeRange[1]);
    if (pondTimeRange.duration() != duration) {
      this.state.duration.set(pondTimeRange.duration());
    }
  }

  updateVisibleRooms(visibleRooms) {
    this.setState({ visibleRooms });
  }

  updateSampleRate(sampleRate) {
    this.state.sampleRate.set(sampleRate);
  }

  render() {
    const { dateTimeRange, visibleRooms, sampleRate, duration } = this.state;
    return (
      <AppModel
        dateTimeRange={dateTimeRange}
        visibleRooms={visibleRooms}
        sampleRate={sampleRate}
        duration={duration}
        dateTimeRangeHandler={this.updateDateTimeRange}
        visibleRoomsHandler={this.updateVisibleRooms}
        sampleRateHandler={this.updateSampleRate}
      />
    );
  }
}

export default AppPresenter;
