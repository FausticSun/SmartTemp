import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppView from './AppView.jsx';
import Temperatures from '../api/collections/Temperatures';

const AppModel = withTracker(({ sampleRate, duration }) => {
  const handle = Meteor.subscribe('Temperatures', {
    sampleRate: sampleRate.get(),
    duration: duration.get()
  });
  const temperatures = Temperatures.find({}).fetch();
  const loading = !handle.ready() && !!temperatures;

  return {
    temperatures,
    loading,
    sampleRate: sampleRate.get(),
    duration: duration.get()
  };
})(AppView);

export default AppModel;
