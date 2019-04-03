import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Temperatures = new Mongo.Collection('Temperatures');

if (Meteor.isServer) {
  Meteor.publish('Temperatures', (dateTimeRange, visibleRooms, samples) => {
    return Temperatures.find();
  });
}

export default Temperatures;
