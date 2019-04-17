import React from 'react';
import PropTypes from 'prop-types';
import '../../client/main.css';
import { AllRooms } from '../constants';

const roomWidth = 120;
const roomHeight = 200;
const roomStrokeWidth = 2;
const numOfRooms = 7;
const deselectedSvgFillColor = 'rgba(235, 235, 235, 0.9)';

const temperatureToRgba = temperature => {
  if (!temperature) return deselectedSvgFillColor;
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
};

const processTemperaturesProp = temperatures => {
  if (temperatures.length === 0) return temperatures;
  temperatures.sort((t1, t2) => t1._id - t2._id);
  if (temperatures.length < numOfRooms) {
    for (let i = 0; i < numOfRooms; i++) {
      if (!temperatures[i] || temperatures[i]._id !== i) {
        temperatures.splice(i, 0, {
          _id: i,
          average: null
        });
      }
    }
  }
  return temperatures;
};

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRooms: props.visibleRooms
    };
    this.roomClickHandler = this.roomClickHandler.bind(this);
  }

  roomClickHandler(roomId) {
    const { visibleRoomsHandler } = this.props;
    const { visibleRooms } = this.state;
    if (visibleRooms.includes(roomId)) {
      visibleRooms.splice(visibleRooms.indexOf(roomId), 1);
    } else {
      visibleRooms.push(roomId);
      visibleRooms.sort();
    }
    this.setState({ visibleRooms });
    visibleRoomsHandler(visibleRooms);
  }

  computeAverageTemp(points) {
    const { dateTimeRange } = this.props;
    const filteredPoints = points.filter(
      pt => pt.timestamp > dateTimeRange[0] && pt.timestamp < dateTimeRange[1]
    );
    const average =
      filteredPoints.reduce((acc, curr) => acc + curr.temperature, 0) / filteredPoints.length;
    return average;
  }

  render() {
    const { temperatures, visibleRooms, visibleRoomsHandler, loading } = this.props;
    if (loading) {
      return null;
    }
    const rooms = processTemperaturesProp(temperatures).map(temperature => {
      const isVisible = visibleRooms.includes(temperature._id);
      return (
        <button
          className={isVisible ? '' : 'hidden'}
          key={temperature._id}
          onClick={() => this.roomClickHandler(temperature._id, visibleRooms, visibleRoomsHandler)}
          type="button"
        >
          <svg
            width={roomWidth + 2 * roomStrokeWidth}
            height={roomHeight + 2 * roomStrokeWidth}
            fill={temperatureToRgba(this.computeAverageTemp(temperature.points))}
            strokeWidth={roomStrokeWidth}
          >
            <rect x={roomStrokeWidth} y={roomStrokeWidth} width={roomWidth} height={roomHeight} />
          </svg>
          <h2>{`Room ${temperature._id}`}</h2>
        </button>
      );
    });
    return <div className="rooms">{rooms}</div>;
  }
}

Rooms.propTypes = {
  temperatures: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number.isRequired,
      points: PropTypes.arrayOf(
        PropTypes.shape({
          timestamp: PropTypes.instanceOf(Date).isRequired,
          temperature: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  visibleRooms: PropTypes.arrayOf(PropTypes.number).isRequired,
  visibleRoomsHandler: PropTypes.func.isRequired,
  dateTimeRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  loading: PropTypes.bool.isRequired
};

export default Rooms;
