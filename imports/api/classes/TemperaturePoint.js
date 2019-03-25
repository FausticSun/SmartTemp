import { Class } from 'meteor/jagi:astronomy';
import Temperatures from '../collections/Temperatures';

const TemperaturePoint = Class.create({
  name: 'TemperaturePoint',
  collection: Temperatures,
  fields: {
    roomId: Number,
    timestamp: Date,
    temperature: Number
  }
});

export default TemperaturePoint;
