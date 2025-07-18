import { parseDateTime, formatDuration } from '../utils';

export const processXlsxData = (jsonData, startTimeHeader, endTimeHeader) => {
  if (jsonData.length === 0) return [];

  const originalHeaders = jsonData[0];
  const lowerCaseHeaders = originalHeaders.map(h => String(h).toLowerCase());

  const startTimeIndex = lowerCaseHeaders.indexOf('start time');
  const endTimeIndex = lowerCaseHeaders.indexOf('end time');
  const usageIndex = lowerCaseHeaders.indexOf('usage');
  const freeUnitNameIndex = lowerCaseHeaders.indexOf('free unit name');

  if (startTimeIndex === -1 || endTimeIndex === -1 || usageIndex === -1) {
    throw new Error("This file does not contain the required 'Usage', 'Start Time', or 'End Time' columns. Please upload a valid call detail record file.");
  }

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
      let mega = 'N/A', giga = 'N/A', duration = 'Invalid Date', durationInSeconds = 0, freeUnitName = 'N/A';

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

      if (freeUnitNameIndex !== -1) {
        const rawFreeUnitName = row[freeUnitNameIndex];
        if (rawFreeUnitName === 'TED_TOPUP_Fixed_Data') {
          freeUnitName = 'EXTENION';
        } else if (rawFreeUnitName === 'TED_Primary_Fixed_Data') {
          freeUnitName = 'Main';
        } else {
            freeUnitName = rawFreeUnitName;
        }
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
      
      rowData[startTimeHeader] = startTimeStr;
      rowData[endTimeHeader] = endTimeStr;
      rowData.Mega = mega;
      rowData.Giga = giga;
      rowData.Duration = duration;
      rowData['Free Unit Name'] = freeUnitName;
      rowData.durationInSeconds = durationInSeconds;
      rowData.startTimeObj = startTime;
      rowData.endTimeObj = endTime;

      return rowData;
    });

  return processedData;
};

export const determineHeaders = (jsonData) => {
  if (jsonData.length === 0) return { finalHeaders: [], determinedStartTimeHeader: '', determinedEndTimeHeader: '' };

  const originalHeaders = jsonData[0];
  const lowerCaseHeaders = originalHeaders.map(h => String(h).toLowerCase());

  const startTimeIndex = lowerCaseHeaders.indexOf('start time');
  const endTimeIndex = lowerCaseHeaders.indexOf('end time');

  const determinedStartTimeHeader = startTimeIndex !== -1 ? originalHeaders[startTimeIndex] : 'Start Time';
  const determinedEndTimeHeader = endTimeIndex !== -1 ? originalHeaders[endTimeIndex] : 'End Time';

  const finalHeaders = [determinedStartTimeHeader, determinedEndTimeHeader, 'Mega', 'Giga', 'Duration', 'Free Unit Name'];
  
  return { finalHeaders, determinedStartTimeHeader, determinedEndTimeHeader };
};
