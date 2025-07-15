import { useState, useEffect, useMemo } from 'react';
import { parseDateTime, formatDuration, sanitizeString } from '../utils';

const xlsxWorker = new Worker(new URL('../xlsx.worker.js', import.meta.url));

const useXlsxData = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [startTimeFilter, setStartTimeFilter] = useState('');
  const [endTimeFilter, setEndTimeFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [currentStartTimeHeader, setCurrentStartTimeHeader] = useState('');
  const [currentEndTimeHeader, setCurrentEndTimeHeader] = useState('');

  useEffect(() => {
    xlsxWorker.onmessage = (event) => {
      setIsLoading(false);
      const { status, jsonData, message } = event.data;
      if (status === 'success') {
        if (jsonData.length > 0) {
          const originalHeaders = jsonData[0];
          const lowerCaseHeaders = originalHeaders.map(h => String(h).toLowerCase());

          const startTimeIndex = lowerCaseHeaders.indexOf('start time');
          const endTimeIndex = lowerCaseHeaders.indexOf('end time');
          const usageIndex = lowerCaseHeaders.indexOf('usage');

          const determinedStartTimeHeader = startTimeIndex !== -1 ? originalHeaders[startTimeIndex] : 'Start Time';
          const determinedEndTimeHeader = endTimeIndex !== -1 ? originalHeaders[endTimeIndex] : 'End Time';

          const finalHeaders = [determinedStartTimeHeader, determinedEndTimeHeader, 'Mega', 'Giga', 'Duration'];
          setHeaders(finalHeaders);

          setCurrentStartTimeHeader(determinedStartTimeHeader);
          setCurrentEndTimeHeader(determinedEndTimeHeader);

          const processedData = jsonData.slice(1)
            .filter(row => {
              if (usageIndex === -1) return true;
              const usage = parseFloat(row[usageIndex]);
              if (isNaN(usage) || usage <= 0) return false;
              
              const mega = (usage / (1024 * 1024)).toFixed(2);
              if (isNaN(parseFloat(mega)) || parseFloat(mega) <= 0) return false;

              return true;
            })
            .map((row, i) => {
              const rowData = { id: i };
              let mega = 'N/A', giga = 'N/A', duration = 'Invalid Date', durationInSeconds = 0;

              const startTimeStr = startTimeIndex !== -1 ? String(row[startTimeIndex]) : '';
              const endTimeStr = endTimeIndex !== -1 ? String(row[endTimeIndex]) : '';

              const rawUsage = usageIndex !== -1 ? row[usageIndex] : NaN;
              const usage = typeof rawUsage === 'number' ? rawUsage : parseFloat(rawUsage);

              if (!isNaN(usage)) {
                mega = (usage / (1024 * 1024)).toFixed(2);
                giga = (usage / (1024 * 1024 * 1024)).toFixed(2);
              } else {
                mega = 'N/A';
                giga = 'N/A';
              }

              const startTime = parseDateTime(startTimeStr);
              const endTime = parseDateTime(endTimeStr);

              if (startTime && endTime) {
                const diff = endTime - startTime;
                if (diff >= 0) {
                  durationInSeconds = Math.floor(diff / 1000);
                  duration = formatDuration(durationInSeconds);
                }
              }
              
              rowData[determinedStartTimeHeader] = startTimeStr;
              rowData[determinedEndTimeHeader] = endTimeStr;
              rowData.Mega = mega;
              rowData.Giga = giga;
              rowData.Duration = duration;
              rowData.durationInSeconds = durationInSeconds;
              rowData.startTimeObj = startTime;

              return rowData;
            });

          setOriginalData(processedData);
          setFilteredData(processedData);
        } else {
          setOriginalData([]);
          setFilteredData([]);
          setHeaders([]);
        }
      } else {
        console.error("Error from Web Worker:", message);
        setErrorMessage("Error processing file: " + message);
        setIsLoading(false);
      }
    };

    return () => {
      xlsxWorker.onmessage = null;
    };
  }, []);

  const handleFileUpload = (file) => {
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessage("Invalid file type. Please upload an .xlsx or .xls file.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const uint8Array = new Uint8Array(evt.target.result);
        if (uint8Array[0] === 0x50 && uint8Array[1] === 0x4B && uint8Array[2] === 0x03 && uint8Array[3] === 0x04) {
          const fullReader = new FileReader();
          fullReader.onload = (e) => {
            xlsxWorker.postMessage({ fileData: e.target.result });
          };
          fullReader.readAsBinaryString(file);
        } else if (file.name.endsWith('.xls')) {
          const fullReader = new FileReader();
          fullReader.onload = (e) => {
            xlsxWorker.postMessage({ fileData: e.target.result });
          };
          fullReader.readAsBinaryString(file);
        }
        else {
          setErrorMessage("File is not a valid XLSX/XLS file (magic number mismatch or unsupported format).");
          setIsLoading(false);
        }
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
  };

  useEffect(() => {
    let data = [...originalData];

    if (filterDate) {
        data = data.filter(row => {
            if (row.startTimeObj) {
                const rowDate = row.startTimeObj.toISOString().split('T')[0];
                return rowDate === filterDate;
            }
            return false;
        });
    }

    if (startTimeFilter && endTimeFilter) {
        const start = parseInt(startTimeFilter.replace(':', ''));
        const end = parseInt(endTimeFilter.replace(':', ''));
        if (isNaN(start) || isNaN(end) || start < 0 || end > 2359 || start > end) {
            setErrorMessage("Invalid time range. Please use HH:MM format and ensure start time is before end time.");
            return;
        }
        data = data.filter(row => {
            if (row.startTimeObj) {
                const rowTime = row.startTimeObj.getHours() * 100 + row.startTimeObj.getMinutes();
                return rowTime >= start && rowTime <= end;
            }
            return false;
        });
    }

    if (sortConfig.key) {
        data.sort((a, b) => {
            let aValue, bValue;
            if (sortConfig.key === 'Giga') {
                aValue = parseFloat(a.Giga);
                bValue = parseFloat(b.Giga);
            } else if (sortConfig.key === 'Duration') {
                aValue = a.durationInSeconds;
                bValue = b.durationInSeconds;
            }

            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }

    setFilteredData(data);
  }, [originalData, filterDate, startTimeFilter, endTimeFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setFilterDate('');
    setStartTimeFilter('');
    setEndTimeFilter('');
    setSortConfig({ key: null, direction: 'ascending' });
    setFilteredData(originalData);
    setErrorMessage(null);
  };

  const clearAllData = () => {
    setOriginalData([]);
    setFilteredData([]);
    setHeaders([]);
    setFilterDate('');
    setStartTimeFilter('');
    setEndTimeFilter('');
    setSortConfig({ key: null, direction: 'ascending' });
    setErrorMessage(null);
    setCurrentStartTimeHeader('');
    setCurrentEndTimeHeader('');
  };

  const totals = useMemo(() => {
    return filteredData.reduce((acc, row) => {
        acc.Mega += parseFloat(row.Mega) || 0;
        acc.Giga += parseFloat(row.Giga) || 0;
        acc.durationInSeconds += row.durationInSeconds || 0;
        return acc;
    }, { Mega: 0, Giga: 0, durationInSeconds: 0 });
  }, [filteredData]);

  return {
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
    clearAllData,
    handleFileUpload,
    totals,
    setErrorMessage,
    startTimeHeader: currentStartTimeHeader,
    endTimeHeader: currentEndTimeHeader
  };
};

export default useXlsxData;
