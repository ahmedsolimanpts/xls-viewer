import React, { memo, useCallback } from 'react';

const Filters = ({
  filterDate, setFilterDate,
  startDateFilter, setStartDateFilter,
  endDateFilter, setEndDateFilter,
  startTimeFilter, setStartTimeFilter,
  endTimeFilter, setEndTimeFilter,
  freeUnitNameFilter, setFreeUnitNameFilter,
  uniqueFreeUnitNames,
  requestSort, clearFilters,
  setShowChart
}) => {
  const handleDateChange = useCallback(e => {
    setFilterDate(e.target.value);
  }, [setFilterDate]);

  const handleStartDateChange = useCallback(e => {
    setStartDateFilter(e.target.value);
  }, [setStartDateFilter]);

  const handleEndDateChange = useCallback(e => {
    setEndDateFilter(e.target.value);
  }, [setEndDateFilter]);

  const handleStartTimeChange = useCallback(e => {
    setStartTimeFilter(e.target.value);
  }, [setStartTimeFilter]);

  const handleEndTimeChange = useCallback(e => {
    setEndTimeFilter(e.target.value);
  }, [setEndTimeFilter]);

  const handleFreeUnitNameChange = useCallback(e => {
    setFreeUnitNameFilter(e.target.value);
  }, [setFreeUnitNameFilter]);

  return (
    <div className="controls">
      <div className="filter-group">
        <label>Filter by Day:</label>
        <input type="date" value={filterDate} onChange={handleDateChange} />
      </div>
      <div className="filter-group">
        <label>Filter by Date Range:</label>
        <input type="date" value={startDateFilter} onChange={handleStartDateChange} />
        <span>-</span>
        <input type="date" value={endDateFilter} onChange={handleEndDateChange} />
      </div>
      <div className="filter-group">
        <label>Filter by Hour Range:</label>
        <input type="time" value={startTimeFilter} onChange={handleStartTimeChange} />
        <span>-</span>
        <input type="time" value={endTimeFilter} onChange={handleEndTimeChange} />
      </div>
      <div className="filter-group">
        <label>Filter by Category:</label>
        <select value={freeUnitNameFilter} onChange={handleFreeUnitNameChange}>
          {uniqueFreeUnitNames.map(name => (
            <option key={name} value={name}>{name || 'All'}</option>
          ))}
        </select>
      </div>
      <div className="sort-group">
        <button onClick={() => requestSort('Start Time')}>Sort by Start Time</button>
        <button onClick={() => requestSort('End Time')}>Sort by End Time</button>
        <button onClick={() => requestSort('Giga')}>Sort by Max Giga</button>
        <button onClick={() => requestSort('Duration')}>Sort by Max Duration</button>
      </div>
      <button onClick={clearFilters}>Clear Filters & Sort</button>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
    </div>
  );
};

export default memo(Filters);