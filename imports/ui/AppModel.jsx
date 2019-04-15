import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppView from './AppView.jsx';
import Temperatures from '../api/collections/Temperatures';

const AppModel = withTracker(({ dateTimeRange, visibleRooms, sampleRate }) => {
  const handle = Meteor.subscribe('Temperatures', {
    dateTimeRange: dateTimeRange.get(),
    visibleRooms: visibleRooms.get(),
    sampleRate: sampleRate.get()
  });
  const loading = !handle.ready();
  const temperatures = Temperatures.find({}).fetch();
  return {
    loading,
    temperatures,
    dateTimeRange: dateTimeRange.get(),
    visibleRooms: visibleRooms.get(),
    sampleRate: sampleRate.get()
  };
})(AppView);

export default AppModel;
