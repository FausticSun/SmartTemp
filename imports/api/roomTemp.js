import { Class } from 'meteor/jagi:astronomy';

const Room = Class.create({
  room_id: Number,
  temperatures: {
    type: [Temperature]
  }
});

const Temperature = Class.create({
  timestamp: Date,
  temperature: Number
});

export Room;
