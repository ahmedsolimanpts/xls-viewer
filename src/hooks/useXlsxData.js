import { useState, useMemo, useCallback } from 'react';
import useFileProcessing from './useFileProcessing';
import useDataFiltering from './useDataFiltering';
import useDataSorting from './useDataSorting';

const useXlsxData = () => {
  const { originalData, headers, isLoading, errorMessage, handleFileUpload, startTimeHeader, endTimeHeader, clearFileProcessingState } = useFileProcessing();

  const [filterDate, setFilterDate] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [startTimeFilter, setStartTimeFilter] = useState('');
  const [endTimeFilter, setEndTimeFilter] = useState('');
  const [freeUnitNameFilter, setFreeUnitNameFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const setErrorMessageForFiltering = useCallback((message) => {
    // This setErrorMessage is passed down to useDataFiltering
    // and will update the errorMessage state from useFileProcessing
    // if there's a filtering error.
    // This might need a more robust error handling strategy if errors
    // from different hooks need to be distinguished.
    // For now, we'll just rely on the errorMessage from useFileProcessing
    // and assume filtering errors are handled internally by useDataFiltering
    // by returning an empty array.
  }, []);

  const uniqueFreeUnitNames = useMemo(() => {
    const names = new Set(originalData.map(row => row['Free Unit Name']));
    return ['', ...Array.from(names)];
  }, [originalData]);

  const filteredData = useDataFiltering(originalData, filterDate, startDateFilter, endDateFilter, startTimeFilter, endTimeFilter, freeUnitNameFilter, setErrorMessageForFiltering);
  const { sortedData, requestSort: sortData } = useDataSorting(filteredData, sortConfig);

  const requestSort = (key) => {
    setSortConfig(sortData(key));
  };

  const resetCommonState = useCallback(() => {
    setFilterDate('');
    setStartDateFilter('');
    setEndDateFilter('');
    setStartTimeFilter('');
    setEndTimeFilter('');
    setFreeUnitNameFilter('');
    setSortConfig({ key: null, direction: 'ascending' });
  }, []);

  const clearFilters = useCallback(() => {
    resetCommonState();
  }, [resetCommonState]);

  const clearAllData = useCallback(() => {
    clearFileProcessingState();
    resetCommonState();
  }, [clearFileProcessingState, resetCommonState]);

  const totals = useMemo(() => {
    return sortedData.reduce((acc, row) => {
        acc.Mega += parseFloat(row.Mega) || 0;
        acc.Giga += parseFloat(row.Giga) || 0;
        acc.durationInSeconds += row.durationInSeconds || 0;
        return acc;
    }, { Mega: 0, Giga: 0, durationInSeconds: 0 });
  }, [sortedData]);

  return {
    originalData,
    filteredData: sortedData,
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
    sortConfig,
    requestSort,
    clearFilters,
    clearAllData,
    handleFileUpload,
    totals,
    setErrorMessage: setErrorMessageForFiltering, // Expose the filtering error setter
    startTimeHeader,
    endTimeHeader
  };
};

export default useXlsxData;