import { Class } from 'meteor/jagi:astronomy';
import Temperature from './Temperature';
import Rooms from '../collections/Rooms';

const Room = Class.create({
  collection: Rooms,
  room_id: Number,
  temperatures: {
    type: [Temperature]
  }
});

export default Room;
