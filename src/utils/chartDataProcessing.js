export const aggregateChartData = (data, groupBy, selectedDay) => {
  if (groupBy === 'day') {
    return data.reduce((acc, row) => {
      if (row.startTimeObj) {
        const day = row.startTimeObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        if (!acc[day]) {
          acc[day] = { Mega: 0, Giga: 0, date: row.startTimeObj };
        }
        acc[day].Mega += parseFloat(row.Mega) || 0;
        acc[day].Giga += parseFloat(row.Giga) || 0;
      }
      return acc;
    }, {});
  } else { // groupBy === 'hour'
    const hourlyData = {};
    data.forEach(row => {
      if (row.startTimeObj && row.startTimeObj.toISOString().split('T')[0] === selectedDay) {
        const hour = row.startTimeObj.getHours();
        const ampmHour = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const label = `${ampmHour}:00 ${ampm} - ${(ampmHour + 1 === 13 ? 1 : ampmHour + 1)}:00 ${ampm}`; // Simplified for display
        if (!hourlyData[label]) {
          hourlyData[label] = { Mega: 0, Giga: 0, hour: hour };
        }
        hourlyData[label].Mega += parseFloat(row.Mega) || 0;
        hourlyData[label].Giga += parseFloat(row.Giga) || 0;
      }
    });
    return hourlyData;
  }
};

export const sortChartLabels = (aggregatedData, groupBy) => {
  if (groupBy === 'day') {
    return Object.keys(aggregatedData).sort((a, b) => aggregatedData[a].date - aggregatedData[b].date);
  } else { // groupBy === 'hour'
    return Object.keys(aggregatedData).sort((a, b) => aggregatedData[a].hour - aggregatedData[b].hour);
  }
};