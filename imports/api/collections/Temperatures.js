import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

const Temperatures = new Mongo.Collection('Temperatures');

if (Meteor.isServer) {
  Meteor.publish('Temperatures', function callback({ dateTimeRange, visibleRooms, sampleRate }) {
    check(dateTimeRange, [Date]);
    check(visibleRooms, [Number]);
    check(sampleRate, Number);

    const startDateTime = dateTimeRange[0];
    const endDateTime = dateTimeRange[1];

    const pipeline = [
      {
        $match: {
          timestamp: {
            $gt: startDateTime,
            $lt: endDateTime
          }
        }
      },
      {
        $bucketAuto: {
          groupBy: '$timestamp',
          buckets: sampleRate,
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
          },
          average: {
            $avg: '$temperature'
          }
        }
      }
    ];
    ReactiveAggregate(this, Temperatures, pipeline);
  });
}

export default Temperatures;
