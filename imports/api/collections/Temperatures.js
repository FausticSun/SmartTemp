import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

const Temperatures = new Mongo.Collection('Temperatures');

if (Meteor.isServer) {
  Meteor.publish('Temperatures', ([startDateTime, endDateTime], visibleRooms, sampleRate) => {
    check(startDateTime, Date);
    check(endDateTime, Date);
    check(visibleRooms, [Number]);
    check(sampleRate, Number);

    const collections = Temperatures.rawCollection();
    const options = { allowDiskUse: false };
    const pipeline = [
      {
        $match: {
          RoomId: {
            $in: visibleRooms
          },
          timestamp: {
            $gt: startDateTime,
            $lt: endDateTime
          }
        }
      },
      {
        $sort: {
          RoomId: 1.0,
          timestamp: 1.0
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
    return collections.aggregate(pipeline, options);
  });
}

export default Temperatures;
