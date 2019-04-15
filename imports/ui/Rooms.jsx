import React from 'react';
import PropTypes from 'prop-types';
import '../../client/main.css';

const roomWidth = 150;
const roomHeight = 250;
const roomStrokeWidth = 3;

const temperatureToRgba = temperature => {
  const temperatureUpper = 40;
  const temperatureLower = 0;
  const temperatureRange = temperatureUpper - temperatureLower;
  const greenUpper = 220;
  const greenLower = 0;
  const greenRange = greenUpper - greenLower;
  const greenTemperatureScale = temperatureRange / greenRange;
  const blueUpper = 255;
  const blueLower = 95;
  const blueRange = blueUpper - blueLower;
  const blueTemperatureScale = temperatureRange / blueRange;

  const red = 0;
  const green = greenUpper - ((temperatureUpper - temperature) / greenTemperatureScale).toFixed(0);
  const blue = blueUpper - ((temperatureUpper - temperature) / blueTemperatureScale).toFixed(0);
  const alpha = 0.9;

  return `rgba(${red.toString()}, ${green.toString()}, ${blue.toString()}, ${alpha.toString()})`;
  // console.log(greenTemperatureScale);
  // console.log(blueTemperatureScale);
  // console.log(temperature);
  // console.log(green);
  // console.log(blue);
  // console.log(rgba);
};

const Rooms = props => {
  const { temperatures, visibleRooms, visibleRoomsHandler } = props;
  const roomClickHandler = roomId => {
    if (visibleRooms.includes(roomId)) {
      visibleRooms.splice(visibleRooms.indexOf(roomId), 1);
    } else {
      visibleRooms.push(roomId);
      visibleRooms.sort();
    }
    visibleRoomsHandler(visibleRooms);
  };

  const rooms = temperatures
    .sort((t1, t2) => t1._id - t2._id)
    .map(temperature => {
      const isVisible = visibleRooms.includes(temperature._id);
      return (
        <button
          className={isVisible ? '' : 'hidden'}
          key={temperature._id}
          onClick={() => roomClickHandler(temperature._id, visibleRooms, visibleRoomsHandler)}
          type="button"
        >
          <svg
            width={roomWidth + 2 * roomStrokeWidth}
            height={roomHeight + 2 * roomStrokeWidth}
            fill={temperatureToRgba(temperature.average)}
            strokeWidth={roomStrokeWidth}
          >
            <rect x={roomStrokeWidth} y={roomStrokeWidth} width={roomWidth} height={roomHeight} />
          </svg>
          <h2>{`Room ${temperature._id}`}</h2>
        </button>
      );
    });
  return <div className="rooms">{rooms}</div>;
};

Rooms.propTypes = {
  temperatures: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      average: PropTypes.number.isRequired
    })
  ).isRequired,
  visibleRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  visibleRoomsHandler: PropTypes.func.isRequired
};

export default Rooms;
