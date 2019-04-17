import React from 'react';
import PropTypes from 'prop-types';
import '../../client/main.css';
import { TimeRange } from 'pondjs';
import { AllRooms } from '../constants';

const roomWidth = 120;
const roomHeight = 200;
const roomStrokeWidth = 2;
const deselectedSvgFillColor = 'rgba(235, 235, 235, 0.9)';

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRooms: props.visibleRooms
    };
    this.roomClickHandler = this.roomClickHandler.bind(this);
  }

  getAverageTemp(id) {
    const { temperatures, dateTimeRange } = this.props;
    if (!temperatures.length || !temperatures) {
      return 0;
    }
    const room = temperatures.find(x => x._id === id);
    if (!room) {
      return 0;
    }
    const filteredPoints = room.points.filter(pt => dateTimeRange.contains(pt.timestamp));
    const average =
      filteredPoints.reduce((acc, curr) => acc + curr.temperature, 0) / filteredPoints.length;
    return average;
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

  temperatureToRgba(id, temperature) {
    const { visibleRooms } = this.props;
    if (!visibleRooms.includes(id)) {
      return deselectedSvgFillColor;
    }
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
    const green =
      greenUpper - ((temperatureUpper - temperature) / greenTemperatureScale).toFixed(0);
    const blue = blueUpper - ((temperatureUpper - temperature) / blueTemperatureScale).toFixed(0);
    const alpha = 0.9;

    return `rgba(${red.toString()}, ${green.toString()}, ${blue.toString()}, ${alpha.toString()})`;
  }

  render() {
    const { visibleRoomsHandler } = this.props;
    const { visibleRooms } = this.state;
    const rooms = AllRooms.map(id => {
      return (
        <button
          key={id}
          onClick={() => this.roomClickHandler(id, visibleRooms, visibleRoomsHandler)}
          type="button"
        >
          <svg
            width={roomWidth + 2 * roomStrokeWidth}
            height={roomHeight + 2 * roomStrokeWidth}
            fill={this.temperatureToRgba(id, this.getAverageTemp(id))}
            strokeWidth={roomStrokeWidth}
          >
            <rect x={roomStrokeWidth} y={roomStrokeWidth} width={roomWidth} height={roomHeight} />
          </svg>
          <h2>{`Room ${id}`}</h2>
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
  dateTimeRange: PropTypes.instanceOf(TimeRange).isRequired,
  loading: PropTypes.bool.isRequired
};

export default Rooms;
