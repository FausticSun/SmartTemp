import React from 'react';
import { ReactiveVar } from 'meteor/reactive-var';
import { debounce } from 'underscore';
import { TimeRange } from 'pondjs';
import AppModel from './AppModel.jsx';
import { FullTimeRange, AllRooms } from '../constants';

class AppPresenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTimeRange: new TimeRange(FullTimeRange.begin(), FullTimeRange.end()),
      visibleRooms: [...AllRooms],
      sampleRate: new ReactiveVar(300),
      duration: new ReactiveVar(FullTimeRange.duration())
    };
    this.updateDateTimeRange = this.updateDateTimeRange.bind(this);
    this.updateVisibleRooms = this.updateVisibleRooms.bind(this);
    this.updateSampleRate = debounce(this.updateSampleRate, 100).bind(this);
    this.updateDuration = debounce(this.updateDuration, 100).bind(this);
  }

  updateDateTimeRange(dateTimeRange) {
    this.setState({ dateTimeRange });
    const { duration } = this.state;
    if (dateTimeRange.duration() !== duration) {
      this.updateDuration(dateTimeRange.duration());
    }
  }

  updateVisibleRooms(visibleRooms) {
    this.setState({ visibleRooms });
  }

  updateSampleRate(sampleRate) {
    this.state.sampleRate.set(sampleRate);
  }

  updateDuration(duration) {
    this.state.duration.set(duration);
  }

  render() {
    const { dateTimeRange, visibleRooms, sampleRate, duration, temperatures } = this.state;
    return (
      <AppModel
        dateTimeRange={dateTimeRange}
        visibleRooms={visibleRooms}
        sampleRate={sampleRate}
        duration={duration}
        temperatures={temperatures}
        temperaturesHandler={this.updateTemperatures}
        dateTimeRangeHandler={this.updateDateTimeRange}
        visibleRoomsHandler={this.updateVisibleRooms}
        sampleRateHandler={this.updateSampleRate}
      />
    );
  }
}

export default AppPresenter;
