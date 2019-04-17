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

const colors = ['#9adbc5', '#eaadcd', '#bed7a0', '#c4b7ea', '#e5bb99', '#70d3e3', '#98c2ec'];
const graphStyle = styler(
  AllRooms.map(id => ({
    key: id.toString(),
    color: colors[id],
    width: 2
  }))
);
const legendStyle = styler(
  AllRooms.map(id => ({
    key: id.toString(),
    color: colors[id],
    width: 5
  }))
);
const categories = AllRooms.map(id => ({
  key: id.toString(),
  label: `Room ${id}`
}));

const Graph = props => {
  const { temperatures, dateTimeRange, dateTimeRangeHandler, visibleRooms } = props;
  const loadedTimeRange = new TimeRange(
    dateTimeRange.begin().getTime() - dateTimeRange.duration(),
    dateTimeRange.end().getTime() + dateTimeRange.duration()
  );
  const filteredTemperatures = temperatures.map(room => ({
    _id: room._id,
    points: room.points.filter(pt => loadedTimeRange.contains(pt.timestamp))
  }));
  const lineCharts = () => {
    return AllRooms.map(id => {
      const name = id;
      const columns = ['time', id.toString()];
      const room = filteredTemperatures.find(x => x._id === id);
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
      <Legend type="line" categories={categories} style={legendStyle} />
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
