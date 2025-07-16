import { useState, useEffect } from 'react';

const useDataFiltering = (originalData, filterDate, startTimeFilter, endTimeFilter, setErrorMessage) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let data = [...originalData];

    if (filterDate) {
      data = data.filter(row => {
        if (row.startTimeObj) {
          const rowDate = row.startTimeObj.toISOString().split('T')[0];
          return rowDate === filterDate;
        }
        return false;
      });
    }

    if (startTimeFilter && endTimeFilter) {
      const start = parseInt(startTimeFilter.replace(':', ''));
      const end = parseInt(endTimeFilter.replace(':', ''));
      if (isNaN(start) || isNaN(end) || start < 0 || end > 2359) {
        setErrorMessage("Invalid time format. Please use HH:MM.");
        return;
      }
      if (start > end) {
        setErrorMessage("End time cannot be earlier than start time.");
        return;
      }
      data = data.filter(row => {
        if (row.startTimeObj) {
          const rowTime = row.startTimeObj.getHours() * 100 + row.startTimeObj.getMinutes();
          return rowTime >= start && rowTime <= end;
        }
        return false;
      });
    }

    setFilteredData(data);
  }, [originalData, filterDate, startTimeFilter, endTimeFilter, setErrorMessage]);

  return filteredData;
};

export default useDataFiltering;
