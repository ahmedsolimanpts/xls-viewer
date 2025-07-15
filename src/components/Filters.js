import React from 'react';

const Filters = ({
  filterDate, setFilterDate,
  startTimeFilter, setStartTimeFilter,
  endTimeFilter, setEndTimeFilter,
  requestSort, clearFilters,
  setShowChart
}) => {
  return (
    <div className="controls">
      <div className="filter-group">
        <label>Filter by Day:</label>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
      </div>
      <div className="filter-group">
        <label>Filter by Hour Range:</label>
        <input type="time" value={startTimeFilter} onChange={e => setStartTimeFilter(e.target.value)} />
        <span>-</span>
        <input type="time" value={endTimeFilter} onChange={e => setEndTimeFilter(e.target.value)} />
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

export default Filters;
