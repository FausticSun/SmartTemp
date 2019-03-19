import { Class } from 'meteor/jagi:astronomy';

const Temperature = Class.create({
  timestamp: Date,
  temperature: Number
});

export default Temperature;
