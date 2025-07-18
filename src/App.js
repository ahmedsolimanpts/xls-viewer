import React, { useState, lazy, useCallback } from 'react';

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
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    startTimeFilter,
    setStartTimeFilter,
    endTimeFilter,
    setEndTimeFilter,
    freeUnitNameFilter,
    setFreeUnitNameFilter,
    uniqueFreeUnitNames,
    requestSort,
    clearFilters,
    clearAllData,
    handleFileUpload,
    totals,
    startTimeHeader,
    endTimeHeader
  } = useXlsxData();

  const [showChart, setShowChart] = useState(false);

  const onFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    // Allows re-uploading the same file
    e.target.value = null;
  }, [handleFileUpload]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Consumption Detail</h1>
        <p className="confidential-note">Data Of Customer Is confedintail and dont share it with any body only with the customer owner</p>
        <div className="button-group">
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose Data To Present
          </label>
          <input id="file-upload" type="file" onChange={onFileChange} accept=".xlsx,.xls" />
          <button onClick={clearAllData} className="clear-data-button">Clear All Data</button>
        </div>
        {isLoading && <p>Processing file... Please wait.</p>}
        {errorMessage && <p className="error-message">Error: {errorMessage} <button onClick={() => { /* Error managed by useFileProcessing */ }}>X</button></p>}
      </header>
      <div className="App-content">
        {originalData.length > 0 && !isLoading && (
          <Filters
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
            startTimeFilter={startTimeFilter}
            setStartTimeFilter={setStartTimeFilter}
            endTimeFilter={endTimeFilter}
            setEndTimeFilter={setEndTimeFilter}
            freeUnitNameFilter={freeUnitNameFilter}
            setFreeUnitNameFilter={setFreeUnitNameFilter}
            uniqueFreeUnitNames={uniqueFreeUnitNames}
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
        <p>&copy; 2025 Consumption Detail. All rights reserved. This app is for personal use only. Powered by <a href="https://github.com/ahmedsolimanpts" target="_blank" rel="noopener noreferrer">Ahmed Soliman</a></p>
      </footer>
    </div>
  );
}

export default App;