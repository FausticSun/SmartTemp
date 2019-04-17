import React from 'react';
import PropTypes from 'prop-types';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';
import { FullTimeRange, AllRooms } from '../constants';

const Graph = props => {
  const { temperatures, dateTimeRange, dateTimeRangeHandler, visibleRooms } = props;
  const lineCharts = () => {
    return AllRooms.map(id => {
      const name = id;
      const columns = ['time', 'value'];
      const room = temperatures.find(x => x._id === id);
      const points = !room
        ? []
        : room.points.map(p => [p.timestamp, p.temperature]).sort((a, b) => a[0] - b[0]);
      const data = {
        name,
        columns,
        points
      };
      const series = new TimeSeries(data);
      const visible = visibleRooms.includes(id);
      return <LineChart key={id} axis="y" visible={visible} series={series} />;
    });
  };

  return (
    <ChartContainer
      timeRange={dateTimeRange}
      width={860}
      enableDragZoom
      enablePanZoom
      onTimeRangeChanged={dateTimeRangeHandler}
      minDuration={36000000}
      minTime={FullTimeRange.begin()}
      maxTime={FullTimeRange.end()}
    >
      <ChartRow height="300">
        <YAxis id="y" label="Temperature" min={0} max={40} width="60" type="linear" />
        <Charts>{lineCharts()}</Charts>
      </ChartRow>
    </ChartContainer>
  );
};

Graph.propTypes = {
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
  dateTimeRange: PropTypes.instanceOf(TimeRange).isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired,
  visibleRooms: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default Graph;
