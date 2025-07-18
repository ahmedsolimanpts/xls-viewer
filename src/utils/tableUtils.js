import { sanitizeString, formatTimeTo12Hour } from '../utils';

export const formatCellValue = (header, row, startTimeHeader, endTimeHeader) => {
  if (header === startTimeHeader && row.startTimeObj) {
    return `${row.startTimeObj.toLocaleDateString()} ${formatTimeTo12Hour(row.startTimeObj.toLocaleTimeString('en-US', { hour12: false }))}`;
  } else if (header === endTimeHeader && row.endTimeObj) {
    return `${row.endTimeObj.toLocaleDateString()} ${formatTimeTo12Hour(row.endTimeObj.toLocaleTimeString('en-US', { hour12: false }))}`;
  } else {
    return sanitizeString(String(row[header]));
  }
};
