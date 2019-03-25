import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import Papa from 'papaparse';
import TemperaturePoint from '../imports/api/classes/TemperaturePoint';

function populateDB() {
  fs.createReadStream(Assets.absoluteFilePath('room-temperatures.csv'))
    .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true }))
    .on(
      'data',
      Meteor.bindEnvironment(({ RoomId: roomId, timestamp, temperature }) =>
        new TemperaturePoint(
          {
            roomId,
            timestamp,
            temperature
          },
          { cast: true }
        ).save()
      )
    );
}

Meteor.startup(() => {
  TemperaturePoint.remove({});
  if (TemperaturePoint.find().count() === 0) {
    console.log('Populating DB');
    populateDB();
  }
});
