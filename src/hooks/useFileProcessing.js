import { useState, useCallback } from 'react';
import useXlsxWorker from './useXlsxWorker';
import useFileHandler from './useFileHandler';
import { processXlsxData, determineHeaders } from '../utils/dataProcessing';

const useFileProcessing = () => {
  const [originalData, setOriginalData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [startTimeHeader, setCurrentStartTimeHeader] = useState('');
  const [endTimeHeader, setCurrentEndTimeHeader] = useState('');

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

  const clearFileProcessingState = useCallback(() => {
    setOriginalData([]);
    setHeaders([]);
    setCurrentStartTimeHeader('');
    setCurrentEndTimeHeader('');
    setErrorMessage(null);
    setIsLoading(false);
    resetWorker();
  }, [resetWorker]);

  return {
    originalData,
    headers,
    isLoading: isLoading || isLoadingFile,
    errorMessage: errorMessage || fileError,
    handleFileUpload: handleFileChange,
    startTimeHeader,
    endTimeHeader,
    clearFileProcessingState,
  };
};

export default useFileProcessing;
