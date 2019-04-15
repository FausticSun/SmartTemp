import React from 'react';
import PropTypes from 'prop-types';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTimeRange: props.dateTimeRange
    };
    this.timeRangeChangeHander = this.timeRangeChangeHander.bind(this);
  }

  timeRangeChangeHander(tr) {
    const { dateTimeRangeHandler } = this.props;
    const timeRange = [tr.begin(), tr.end()];
    this.setState({ dateTimeRange: timeRange });
    dateTimeRangeHandler(timeRange);
  }

  render() {
    const { temperatures } = this.props;
    const { dateTimeRange } = this.state;
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
      <ChartContainer
        timeRange={timeRange()}
        width={800}
        enableDragZoom
        enablePanZoom
        onTimeRangeChanged={this.timeRangeChangeHander}
        minDuration={36000000}
        minTime={new Date('2013-10-02T05:00:00')}
        maxTime={new Date('2013-12-03T15:15:00')}
      >
        <ChartRow height="200">
          <YAxis id="y" label="Temperature" min={0} max={40} width="60" type="linear" />
          <Charts>{lineCharts()}</Charts>
        </ChartRow>
      </ChartContainer>
    );
  }
}

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
