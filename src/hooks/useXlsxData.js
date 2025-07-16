import { useState, useMemo, useCallback } from 'react';
import useXlsxWorker from './useXlsxWorker';
import useDataFiltering from './useDataFiltering';
import useDataSorting from './useDataSorting';
import useFileHandler from './useFileHandler'; // Import the new hook
import { processXlsxData, determineHeaders } from '../utils/dataProcessing';

const useXlsxData = () => {
  const [originalData, setOriginalData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [startTimeFilter, setStartTimeFilter] = useState('');
  const [endTimeFilter, setEndTimeFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [currentStartTimeHeader, setCurrentStartTimeHeader] = useState('');
  const [currentEndTimeHeader, setCurrentEndTimeHeader] = useState('');

  const handleWorkerSuccess = useCallback((jsonData) => {
    if (jsonData.length > 0) {
      try {
        const { finalHeaders, determinedStartTimeHeader, determinedEndTimeHeader } = determineHeaders(jsonData);
        setHeaders(finalHeaders);
        setCurrentStartTimeHeader(determinedStartTimeHeader);
        setCurrentEndTimeHeader(determinedEndTimeHeader);

        const processedData = processXlsxData(jsonData, determinedStartTimeHeader, determinedEndTimeHeader);
        setOriginalData(processedData);
      } catch (error) {
        setErrorMessage(error.message);
        setOriginalData([]);
        setHeaders([]);
      }
    } else {
      setOriginalData([]);
      setHeaders([]);
    }
  }, []);

  const handleWorkerError = useCallback((message) => {
    console.error("Error from Web Worker:", message);
    setErrorMessage("Error processing file: " + message);
  }, []);

  const handleWorkerMessage = useCallback((event) => {
    setIsLoading(false);
    const { status, jsonData, message } = event.data;
    if (status === 'success') {
      handleWorkerSuccess(jsonData);
    } else {
      handleWorkerError(message);
    }
  }, [handleWorkerSuccess, handleWorkerError]);

  const { postMessageToWorker, resetWorker } = useXlsxWorker(handleWorkerMessage, handleWorkerError);

  const { handleFileChange, isLoadingFile, fileError } = useFileHandler(
    (fileData) => {
      setIsLoading(true);
      postMessageToWorker({ fileData });
    },
    (error) => {
      setErrorMessage(error);
    }
  );

  const filteredData = useDataFiltering(originalData, filterDate, startTimeFilter, endTimeFilter, setErrorMessage);
  const { sortedData, requestSort: sortData } = useDataSorting(filteredData, sortConfig);

  const requestSort = (key) => {
    setSortConfig(sortData(key));
  };

  const resetCommonState = useCallback(() => {
    setFilterDate('');
    setStartTimeFilter('');
    setEndTimeFilter('');
    setSortConfig({ key: null, direction: 'ascending' });
    setErrorMessage(null);
  }, []);

  const clearFilters = useCallback(() => {
    resetCommonState();
  }, [resetCommonState]);

  const clearAllData = useCallback(() => {
    setOriginalData([]);
    setHeaders([]);
    setCurrentStartTimeHeader('');
    setCurrentEndTimeHeader('');
    resetCommonState();
    resetWorker();
  }, [resetCommonState, resetWorker]);

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
    isLoading: isLoading || isLoadingFile,
    errorMessage: errorMessage || fileError,
    filterDate,
    setFilterDate,
    startTimeFilter,
    setStartTimeFilter,
    endTimeFilter,
    setEndTimeFilter,
    sortConfig,
    requestSort,
    clearFilters,
    clearAllData,
    handleFileUpload: handleFileChange,
    totals,
    setErrorMessage,
    startTimeHeader: currentStartTimeHeader,
    endTimeHeader: currentEndTimeHeader
  };
};

export default useXlsxData;