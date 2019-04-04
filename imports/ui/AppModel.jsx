import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import AppView from './AppView.jsx';
import Temperatures from '../api/collections/Temperatures';

const AppModel = withTracker(({ dateTimeRange, visibleRooms, sampleRate }) => {
  const handle = Meteor.subscribe('Temperatures', { dateTimeRange, visibleRooms, sampleRate });
  const loading = !handle.ready();
  const temperatures = Temperatures.find({}).fetch();
  const temperaturesExists = !loading && !!temperatures;
  return {
    loading,
    temperatures,
    temperaturesExists
  };
})(AppView);

export default AppModel;
