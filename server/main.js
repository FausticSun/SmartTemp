import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import Papa from 'papaparse';
import Temperatures from '../imports/api/collections/Temperatures';

function populateDB() {
  // eslint-disable-next-line no-undef
  Papa.parse(fs.createReadStream(Assets.absoluteFilePath('room-temperatures.csv')), {
    header: true,
    complete: Meteor.bindEnvironment(results =>
      Temperatures.batchInsert(
        results.data.map(temperaturePoint => ({
          RoomId: Number(temperaturePoint.RoomId),
          timestamp: new Date(temperaturePoint.timestamp),
          temperature: Number(temperaturePoint.temperature)
        }))
      )
    )
  });
}

Meteor.startup(() => {
  if (Temperatures.find().count() === 0) {
    populateDB();
    Temperatures.rawCollection().createIndex({
      RoomId: 1,
      timestamp: -1
    });
  }
});
