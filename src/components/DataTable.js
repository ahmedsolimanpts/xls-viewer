import React, { memo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { formatDuration, sanitizeString, formatTimeTo12Hour } from '../utils';

const formatCellValue = (header, row, startTimeHeader, endTimeHeader) => {
  if (header === startTimeHeader && row.startTimeObj) {
    return `${row.startTimeObj.toLocaleDateString()} ${formatTimeTo12Hour(row.startTimeObj.toLocaleTimeString('en-US', { hour12: false }))}`;
  } else if (header === endTimeHeader && row.endTimeObj) {
    return `${row.endTimeObj.toLocaleDateString()} ${formatTimeTo12Hour(row.endTimeObj.toLocaleTimeString('en-US', { hour12: false }))}`;
  } else {
    return sanitizeString(String(row[header]));
  }
};

const DataTable = ({ filteredData, headers, totals, startTimeHeader, endTimeHeader }) => {
  const Row = useCallback(({ index, style }) => {
    const row = filteredData[index];
    return (
      <div style={style} className="table-row">
        {headers.map(header => (
          <div key={`${row.id}-${header}`} className="table-cell">
            {formatCellValue(header, row, startTimeHeader, endTimeHeader)}
          </div>
        ))}
      </div>
    );
  }, [filteredData, headers, startTimeHeader, endTimeHeader]);

  return (
    <div className="table-container"> {/* Main container for virtualized table */}
      <div className="table-header-fixed"> {/* Header for virtualized table */}
        <div className="table-row-header">
          {headers.map((cell, i) => (
            <div key={i} className="table-cell-header">
              {cell}
            </div>
          ))}
        </div>
      </div>
      <FixedSizeList
        height={400} // Fixed height for the scrollable area
        itemCount={filteredData.length}
        itemSize={50} // Approximate height of each row
        width="100%"
        itemData={filteredData}
      >
        {Row}
      </FixedSizeList>
      <div className="table-footer-fixed"> {/* Footer for virtualized table */}
        <div className="table-row-footer">
          <div className="table-cell-footer" style={{ textAlign: 'right', fontWeight: 'bold', flex: 2 }}>Total:</div>
          <div className="table-cell-footer">{totals.Mega.toFixed(2)} MB</div>
          <div className="table-cell-footer">{totals.Giga.toFixed(2)} GB</div>
          <div className="table-cell-footer">{formatDuration(totals.durationInSeconds)}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(DataTable);