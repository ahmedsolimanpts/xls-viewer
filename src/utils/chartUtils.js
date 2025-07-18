export const generateChartOptions = (groupBy, dataType, chartType) => {
  const commonOptions = {
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
  };

  if (chartType === 'pie') {
    return {
      ...commonOptions,
      title: {
        display: true,
        text: `Total ${dataType} Consumption by Category`,
      },
    };
  } else {
    return {
      ...commonOptions,
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
    };
  }
};

export const generateChartData = (sortedLabels, aggregatedData, dataType, chartType) => {
  const backgroundColors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(199, 199, 199, 0.5)',
  ];

  if (chartType === 'pie') {
    return {
      labels: sortedLabels,
      datasets: [
        {
          label: `${dataType} Consumption`,
          data: sortedLabels.map(label => aggregatedData[label][dataType]),
          backgroundColor: backgroundColors.slice(0, sortedLabels.length),
          borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
          borderWidth: 1,
        },
      ],
    };
  } else {
    return {
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
          borderColor: 
            dataType === 'Mega' ? 'rgba(255, 99, 132, 1)' : 
            dataType === 'Giga' ? 'rgba(54, 162, 235, 1)' : 
            dataType === 'Main' ? 'rgba(75, 192, 192, 1)' : 
            dataType === 'EXTENION' ? 'rgba(153, 102, 255, 1)' : 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          fill: false, // For line charts
        },
      ],
    };
  }
};
