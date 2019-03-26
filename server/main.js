import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import Papa from 'papaparse';
import Temperatures from '../imports/api/collections/Temperatures';

function convertAndInsertData(data) {
  console.log('Converting data points');
  const temperaturePoints = data.map(({ RoomId: roomId, timestamp, temperature }) => {
    return {
      roomId: Number(roomId),
      timestamp: new Date(timestamp),
      temperature: Number(temperature)
    };
  });
  console.log('Conversion complete');
  console.log(temperaturePoints);
  temperaturePoints.forEach(point =>
    Temperatures.insert(point, () => console.log('Insert success'))
  );
}

function populateDB() {
  Papa.parse(fs.createReadStream(Assets.absoluteFilePath('room-temperatures.csv')), {
    header: true,
    complete: results => Meteor.bindEnvironment(convertAndInsertData(results.data))
  });
}

Meteor.startup(() => {
  Temperatures.remove({});
  if (Temperatures.find().count() === 0) {
    console.log('Populating DB');
    populateDB();
  }
});
