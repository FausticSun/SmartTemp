import React from 'react';
import { ReactiveVar } from 'meteor/reactive-var';
import { debounce } from 'underscore';
import AppModel from './AppModel.jsx';
import { FullTimeRange } from '../constants';

class AppPresenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleRate: new ReactiveVar(300),
      duration: new ReactiveVar(FullTimeRange.duration())
    };
    this.updateSampleRate = debounce(this.updateSampleRate, 100).bind(this);
    this.updateDuration = debounce(this.updateDuration, 100).bind(this);
  }

  updateDuration(newDuration) {
    const { duration } = this.state;
    if (newDuration !== duration) {
      this.state.duration.set(newDuration);
    }
  }

  updateSampleRate(sampleRate) {
    this.state.sampleRate.set(sampleRate);
  }

  render() {
    const { sampleRate, duration } = this.state;
    return (
      <AppModel
        sampleRate={sampleRate}
        duration={duration}
        sampleRateHandler={this.updateSampleRate}
        durationHandler={this.updateDuration}
      />
    );
  }
}

export default AppPresenter;
