import React, { useState, useMemo, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { aggregateChartData, sortChartLabels } from './utils/chartDataProcessing';
import { generateChartOptions, generateChartData } from './utils/chartUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const DataChart = ({ data, onClose }) => {
  const [dataType, setDataType] = useState('Mega'); // 'Mega', 'Giga', 'Main', or 'EXTENION'
  const [groupBy, setGroupBy] = useState('day'); // 'day' or 'hour'
  const [selectedDay, setSelectedDay] = useState('');
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'pie'

  // Extract all unique days from the data for the date picker
  const uniqueDays = useMemo(() => {
    const days = new Set();
    data.forEach(row => {
      if (row.startTimeObj) {
        days.add(row.startTimeObj.toISOString().split('T')[0]);
      }
    });
    return Array.from(days).sort();
  }, [data]);

  // Set initial selectedDay to the first available day if not already set
  useEffect(() => {
    if (groupBy === 'hour' && !selectedDay && uniqueDays.length > 0) {
      setSelectedDay(uniqueDays[0]);
    }
  }, [groupBy, selectedDay, uniqueDays]);

  const aggregatedData = useMemo(() => aggregateChartData(data, groupBy, selectedDay), [data, groupBy, selectedDay]);
  const sortedLabels = useMemo(() => sortChartLabels(aggregatedData, groupBy), [aggregatedData, groupBy]);

  const total = useMemo(() => {
    return sortedLabels.reduce((acc, label) => acc + aggregatedData[label][dataType], 0);
  }, [sortedLabels, aggregatedData, dataType]);

  const chartData = useMemo(() => generateChartData(sortedLabels, aggregatedData, dataType, chartType), [sortedLabels, aggregatedData, dataType, chartType]);
  const options = useMemo(() => generateChartOptions(groupBy, dataType, chartType), [groupBy, dataType, chartType]);

  return (
    <div className="chart-modal">
      <div className="chart-container">
        <div className="chart-header">
          <h2>Consumption Chart</h2>
          <div className="chart-toggle">
            <button onClick={() => setChartType('bar')} className={chartType === 'bar' ? 'active' : ''}>Bar Chart</button>
            <button onClick={() => setChartType('line')} className={chartType === 'line' ? 'active' : ''}>Line Chart</button>
            <button onClick={() => setChartType('pie')} className={chartType === 'pie' ? 'active' : ''}>Pie Chart</button>
          </div>
          <div className="chart-toggle">
            <label htmlFor="dataType-select">Select Data Type:</label>
            <select id="dataType-select" value={dataType} onChange={e => setDataType(e.target.value)}>
              <option value="Mega">Mega</option>
              <option value="Giga">Giga</option>
              <option value="Main">Main Quota</option>
              <option value="EXTENION">Extension Quota</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="chart-toggle">
            <button onClick={() => setGroupBy('day')} className={groupBy === 'day' ? 'active' : ''}>By Day</button>
            <button onClick={() => setGroupBy('hour')} className={groupBy === 'hour' ? 'active' : ''}>By Hours</button>
          </div>
          {groupBy === 'hour' && uniqueDays.length > 0 && (
            <div className="date-picker-chart">
              <label htmlFor="chart-date-select">Select Day:</label>
              <select id="chart-date-select" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {uniqueDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          )}
          <button onClick={onClose} className="close-button">X</button>
        </div>
        <div className="chart-total">
          <h3>Total {dataType}: {total.toFixed(2)} {dataType === 'Mega' ? 'Mega' : 'Giga'}</h3>
        </div>
        {chartType === 'bar' && <Bar options={options} data={chartData} />}
        {chartType === 'line' && <Line options={options} data={chartData} />}
        {chartType === 'pie' && <Pie options={options} data={chartData} />}
      </div>
    </div>
  );
};

export default DataChart;