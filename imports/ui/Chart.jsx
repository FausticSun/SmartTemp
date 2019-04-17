// Using a modified react-timeseries-chart by FausticSun (i.e. me)
// Referred to https://software.es.net/react-timeseries-charts/#/example/currency for legend implmentation

import React from 'react';
import PropTypes from 'prop-types';
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Legend,
  styler
} from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';
import { FullTimeRange, AllRooms } from '../constants';

const colors = ['#4682b4', '#7982c9', '#b77ac9', '#ee6eb1', '#ff6d86', '#ff8351', '#ffa600'];
const graphStyle = styler(
  AllRooms.map(id => ({
    key: id.toString(),
    color: colors[id],
    width: 1
  }))
);
const categories = AllRooms.map(id => ({
  key: id.toString(),
  label: `Room ${id}`
}));

const Graph = props => {
  const { temperatures, dateTimeRange, dateTimeRangeHandler, visibleRooms } = props;
  const lineCharts = () => {
    return AllRooms.map(id => {
      const name = id;
      const columns = ['time', id.toString()];
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
      return (
        <LineChart
          key={id}
          columns={[id.toString()]}
          style={graphStyle}
          axis="y"
          visible={visible}
          series={series}
        />
      );
    });
  };

  return (
    <div>
      <Legend type="line" categories={categories} style={graphStyle} />
      <ChartContainer
        timeRange={dateTimeRange}
        width={860}
        enableDragZoom
        enablePanZoom
        onTimeRangeChanged={dateTimeRangeHandler}
        minDuration={1000 * 60 * 60 * 12}
        minTime={FullTimeRange.begin()}
        maxTime={FullTimeRange.end()}
      >
        <ChartRow height="300">
          <YAxis id="y" label="Temperature" min={0} max={40} width="60" type="linear" />
          <Charts>{lineCharts()}</Charts>
        </ChartRow>
      </ChartContainer>
    </div>
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
