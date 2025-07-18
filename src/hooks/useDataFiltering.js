import { useMemo } from 'react';

const filterBySingleDate = (data, filterDate) => {
  if (!filterDate) return data;
  const targetDate = new Date(filterDate);
  targetDate.setHours(0, 0, 0, 0);
  return data.filter(row => {
    if (!row.startTimeObj) return false;
    const rowDate = new Date(row.startTimeObj);
    rowDate.setHours(0, 0, 0, 0);
    return rowDate.getTime() === targetDate.getTime();
  });
};

const filterByDateRange = (data, startDateFilter, endDateFilter) => {
  if (!startDateFilter || !endDateFilter) return data;
  const start = new Date(startDateFilter);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDateFilter);
  end.setHours(23, 59, 59, 999);
  return data.filter(row => {
    if (!row.startTimeObj) return false;
    const rowDate = new Date(row.startTimeObj);
    return rowDate >= start && rowDate <= end;
  });
};

const filterByStartTime = (data, startTimeFilter) => {
  if (!startTimeFilter) return data;
  const [startHours, startMinutes] = startTimeFilter.split(':').map(Number);
  return data.filter(row => {
    if (!row.startTimeObj) return false;
    const rowHours = row.startTimeObj.getHours();
    const rowMinutes = row.startTimeObj.getMinutes();
    return rowHours > startHours || (rowHours === startHours && rowMinutes >= startMinutes);
  });
};

const filterByEndTime = (data, endTimeFilter) => {
  if (!endTimeFilter) return data;
  const [endHours, endMinutes] = endTimeFilter.split(':').map(Number);
  return data.filter(row => {
    if (!row.startTimeObj) return false;
    const rowHours = row.startTimeObj.getHours();
    const rowMinutes = row.startTimeObj.getMinutes();
    return rowHours < endHours || (rowHours === endHours && rowMinutes <= endMinutes);
  });
};

const filterByFreeUnitName = (data, freeUnitNameFilter) => {
  if (!freeUnitNameFilter) return data;
  return data.filter(row => row['Free Unit Name'] === freeUnitNameFilter);
};

const useDataFiltering = (data, filterDate, startDateFilter, endDateFilter, startTimeFilter, endTimeFilter, freeUnitNameFilter, setErrorMessage) => {
  return useMemo(() => {
    try {
      let filtered = data;

      filtered = filterBySingleDate(filtered, filterDate);
      filtered = filterByDateRange(filtered, startDateFilter, endDateFilter);
      filtered = filterByStartTime(filtered, startTimeFilter);
      filtered = filterByEndTime(filtered, endTimeFilter);
      filtered = filterByFreeUnitName(filtered, freeUnitNameFilter);
      
      setErrorMessage(null);
      return filtered;
    } catch (error) {
      console.error("Error during filtering:", error);
      setErrorMessage("Failed to apply filters. Please check the input values.");
      return []; // Return empty array on error to prevent rendering issues
    }
  }, [data, filterDate, startDateFilter, endDateFilter, startTimeFilter, endTimeFilter, freeUnitNameFilter, setErrorMessage]);
};

export default useDataFiltering;