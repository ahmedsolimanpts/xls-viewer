import React, { memo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { formatCellValue } from '../utils/tableUtils';
import DataTableFooter from './DataTableFooter';

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
      <DataTableFooter totals={totals} />
    </div>
  );
};

export default memo(DataTable);