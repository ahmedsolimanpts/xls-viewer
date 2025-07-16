import React, { useState, useMemo, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { aggregateChartData, sortChartLabels } from './utils/chartDataProcessing';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataChart = ({ data, onClose }) => {
  const [dataType, setDataType] = useState('Mega'); // 'Mega' or 'Giga'
  const [groupBy, setGroupBy] = useState('day'); // 'day' or 'hour'
  const [selectedDay, setSelectedDay] = useState('');

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

  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: `${dataType} Consumption`,
        data: sortedLabels.map(label => aggregatedData[label][dataType]),
        backgroundColor: dataType === 'Mega' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${groupBy === 'day' ? 'Daily' : 'Hourly'} ${dataType} Consumption`,
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: groupBy === 'day' ? 'Date' : 'Time of Day'
            }
        },
        y: {
            title: {
                display: true,
                text: dataType
            }
        }
    }
  };

  return (
    <div className="chart-modal">
      <div className="chart-container">
        <div className="chart-header">
          <h2>Consumption Chart</h2>
          <div className="chart-toggle">
            <button onClick={() => setDataType('Mega')} className={dataType === 'Mega' ? 'active' : ''}>Mega</button>
            <button onClick={() => setDataType('Giga')} className={dataType === 'Giga' ? 'active' : ''}>Giga</button>
          </div>
          <div className="chart-toggle">
            <button onClick={() => setGroupBy('day')} className={groupBy === 'day' ? 'active' : ''}>By Day</button>
            <button onClick={() => setGroupBy('hour')} className={groupBy === 'hour' ? 'active' : ''}>By Time</button>
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
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default DataChart;