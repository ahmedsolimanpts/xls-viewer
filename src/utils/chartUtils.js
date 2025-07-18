export const generateChartOptions = (groupBy, dataType) => ({
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
              text: groupBy === 'day' ? 'Date' : 'Hour of Day'
          }
      },
      y: {
          title: {
              display: true,
              text: dataType
          }
      }
  }
});

export const generateChartData = (sortedLabels, aggregatedData, dataType) => ({
  labels: sortedLabels,
  datasets: [
    {
      label: `${dataType} Consumption`,
      data: sortedLabels.map(label => aggregatedData[label][dataType]),
      backgroundColor: 
        dataType === 'Mega' ? 'rgba(255, 99, 132, 0.5)' : 
        dataType === 'Giga' ? 'rgba(54, 162, 235, 0.5)' : 
        dataType === 'Main' ? 'rgba(75, 192, 192, 0.5)' : 
        dataType === 'EXTENION' ? 'rgba(153, 102, 255, 0.5)' : 'rgba(255, 206, 86, 0.5)',
    },
  ],
});
