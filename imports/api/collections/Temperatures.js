import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { TimeRange } from 'pondjs';

const Temperatures = new Mongo.Collection('Temperatures');

if (Meteor.isServer) {
  Meteor.publish('Temperatures', function callback({ duration, sampleRate }) {
    check(duration, Number);
    check(sampleRate, Number);
    const fullStartDateTime = new Date('2013-10-02T05:00:00');
    const fullEndDateTime = new Date('2013-12-03T15:15:00');
    const fullTimeRange = new TimeRange(fullStartDateTime, fullEndDateTime);
    const fullDuration = fullTimeRange.duration();

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
