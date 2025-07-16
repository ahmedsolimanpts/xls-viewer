import React, { memo, useCallback } from 'react';

const Filters = ({
  filterDate, setFilterDate,
  startTimeFilter, setStartTimeFilter,
  endTimeFilter, setEndTimeFilter,
  requestSort, clearFilters,
  setShowChart
}) => {
  const handleDateChange = useCallback(e => {
    setFilterDate(e.target.value);
  }, [setFilterDate]);

  const handleStartTimeChange = useCallback(e => {
    setStartTimeFilter(e.target.value);
  }, [setStartTimeFilter]);

  const handleEndTimeChange = useCallback(e => {
    setEndTimeFilter(e.target.value);
  }, [setEndTimeFilter]);

  return (
    <div className="controls">
      <div className="filter-group">
        <label>Filter by Day:</label>
        <input type="date" value={filterDate} onChange={handleDateChange} />
      </div>
      <div className="filter-group">
        <label>Filter by Hour Range:</label>
        <input type="time" value={startTimeFilter} onChange={handleStartTimeChange} />
        <span>-</span>
        <input type="time" value={endTimeFilter} onChange={handleEndTimeChange} />
      </div>
      <div className="sort-group">
        <button onClick={() => requestSort('Giga')}>Sort by Max Giga</button>
        <button onClick={() => requestSort('Duration')}>Sort by Max Duration</button>
      </div>
      <button onClick={clearFilters}>Clear Filters & Sort</button>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
    </div>
  );
};

export default memo(Filters);