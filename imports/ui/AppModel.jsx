import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppView from './AppView.jsx';
import Temperatures from '../api/collections/Temperatures';

const AppModel = withTracker(({ sampleRate, duration }) => {
  const handle = Meteor.subscribe('Temperatures', {
    sampleRate: sampleRate.get(),
    duration: duration.get()
  });
  const loading = !handle.ready();
  const temperatures = Temperatures.find({}).fetch();
  return {
    loading,
    temperatures,
    sampleRate: sampleRate.get(),
    duration: duration.get()
  };
})(AppView);

export default AppModel;
