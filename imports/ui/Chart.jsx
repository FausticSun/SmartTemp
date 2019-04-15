import React from 'react';
import PropTypes from 'prop-types';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';

const Graph = props => {
  const { temperatures, dateTimeRange, dateTimeRangeHandler } = props;
  const timeRange = () => {
    if (!dateTimeRange) {
      return null;
    }
    return new TimeRange(dateTimeRange);
  };
  const lineCharts = () => {
    if (!temperatures.length) {
      return null;
    }
    return temperatures.map(t => {
      const data = {
        name: t._id.toString(),
        columns: ['time', 'value'],
        points: t.points.map(p => [p.timestamp, p.temperature]).sort((a, b) => a[0] - b[0])
      };
      const series = new TimeSeries(data);
      return <LineChart key={t._id} axis="y" series={series} />;
    });
  };
  return (
    <ChartContainer timeRange={timeRange()} width={860}>
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
  dateTimeRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  dateTimeRangeHandler: PropTypes.func.isRequired
};

export default Graph;
