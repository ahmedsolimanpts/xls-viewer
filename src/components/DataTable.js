import React from 'react';
import { FixedSizeList } from 'react-window';
import { formatDuration, sanitizeString } from '../utils';

const DataTable = ({ filteredData, headers, totals, startTimeHeader, endTimeHeader }) => {
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
        {({ index, style }) => {
          const row = filteredData[index];
          return (
            <div style={style} className="table-row">
              {headers.map(header => (
                <div key={`${row.id}-${header}`} className="table-cell">
                  {header === startTimeHeader || header === endTimeHeader
                    ? String(row[header])
                    : sanitizeString(String(row[header]))}
                </div>
              ))}
            </div>
          );
        }}
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

export default DataTable;
