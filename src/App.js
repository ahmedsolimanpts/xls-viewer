import React, { useState, lazy } from 'react';
import './App.css';
import useXlsxData from './hooks/useXlsxData';
import DataTable from './components/DataTable';
import Filters from './components/Filters';

const DataChart = lazy(() => import('./Chart')); // Lazy load the Chart component

function App() {
  const {
    originalData,
    filteredData,
    headers,
    isLoading,
    errorMessage,
    filterDate,
    setFilterDate,
    startTimeFilter,
    setStartTimeFilter,
    endTimeFilter,
    setEndTimeFilter,
    sortConfig,
    requestSort,
    clearFilters,
    handleFileUpload,
    totals,
    setErrorMessage,
    startTimeHeader,
    endTimeHeader
  } = useXlsxData();

  const [showChart, setShowChart] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>XLSX Viewer</h1>
        <input type="file" onChange={e => handleFileUpload(e.target.files[0])} />
        {isLoading && <p>Processing file... Please wait.</p>}
        {errorMessage && <p className="error-message">Error: {errorMessage} <button onClick={() => setErrorMessage(null)}>X</button></p>}
      </header>
      <div className="App-content">
        {originalData.length > 0 && !isLoading && (
          <Filters
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            startTimeFilter={startTimeFilter}
            setStartTimeFilter={setStartTimeFilter}
            endTimeFilter={endTimeFilter}
            setEndTimeFilter={setEndTimeFilter}
            requestSort={requestSort}
            clearFilters={clearFilters}
            setShowChart={setShowChart}
          />
        )}
        {originalData.length > 0 && !isLoading && (
          <DataTable
            filteredData={filteredData}
            headers={headers}
            totals={totals}
            startTimeHeader={startTimeHeader}
            endTimeHeader={endTimeHeader}
          />
        )}
        {showChart && <DataChart data={filteredData} onClose={() => setShowChart(false)} />}
      </div>
      <footer>
        <p>&copy; 2024 XLSX Viewer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;