import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { TimeRange } from 'pondjs';
import { FullTimeRange } from '../../constants.js';

const Temperatures = new Mongo.Collection('Temperatures');

if (Meteor.isServer) {
  Meteor.publish('Temperatures', function callback({ duration, sampleRate }) {
    check(duration, Number);
    check(sampleRate, Number);

    const fullDuration = FullTimeRange.duration();

    const totalSamples = Math.round((fullDuration / duration) * sampleRate);

    const pipeline = [
      {
        $bucketAuto: {
          groupBy: '$timestamp',
          buckets: totalSamples,
          output: {
            data: {
              $push: {
                RoomId: '$RoomId',
                temperature: '$temperature'
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$data'
        }
      },
      {
        $group: {
          _id: {
            RoomId: '$data.RoomId',
            timestamp: '$_id.min'
          },
          temperature: {
            $avg: '$data.temperature'
          }
        }
      },
      {
        $group: {
          _id: '$_id.RoomId',
          points: {
            $push: {
              timestamp: '$_id.timestamp',
              temperature: '$temperature'
            }
          }
        }
      }
    ];
    ReactiveAggregate(this, Temperatures, pipeline);
  });
}

export default Temperatures;
