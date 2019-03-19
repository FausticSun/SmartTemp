import { Meteor } from 'meteor/meteor';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import map from 'lodash/fp/map';
import groupBy from 'lodash/fp/groupBy';
import toPairs from 'lodash/fp/toPairs';
import forEach from 'lodash/fp/forEach';
import flow from 'lodash/fp/flow';
import Rooms from '../imports/api/collections/Rooms';
import Room from '../imports/api/classes/Room';
import Temperature from '../imports/api/classes/Temperature';

function createTemperature(dataPoint) {
  return new Temperature(
    {
      timestamp: new Date(dataPoint.timestamp),
      temperature: dataPoint.temperature
    },
    { cast: true }
  );
}

function createRoom([dataPointList, roomId]) {
  return new Room(
    {
      roomId,
      temperatures: map(createTemperature)(dataPointList)
    },
    { cast: true }
  );
}

function readRooms() {
  const results = [];
  fs.createReadStream('room-temperatures.csv')
    .pipe(csv())
    .on('data', data => results.push(data));
  const roomList = flow(
    groupBy(dataPoint => dataPoint.RoomId),
    toPairs,
    map(createRoom)
  )(results);
  forEach(room => room.save())(roomList);
}

Meteor.startup(() => {
  if (Rooms.find().count() === 0) {
    readRooms();
  }
});
