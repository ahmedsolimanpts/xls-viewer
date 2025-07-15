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
    
    requestSort,
    clearFilters,
    clearAllData,
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
        <div className="button-group">
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose XLSX File
          </label>
          <input id="file-upload" type="file" onChange={e => handleFileUpload(e.target.files[0])} />
          <button onClick={clearAllData} className="clear-data-button">Clear All Data</button>
        </div>
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
        <p>&copy; 2025 XLSX Viewer. All rights reserved. Powered by <a href="https://github.com/ahmedsolimanpts" target="_blank" rel="noopener noreferrer">Ahmed Soliman</a></p>
      </footer>
    </div>
  );
}

export default App;