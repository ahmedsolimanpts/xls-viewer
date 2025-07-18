import React, { memo } from 'react';
import { formatDuration } from '../utils';

const DataTableFooter = ({ totals }) => {
  return (
    <div className="table-footer-fixed"> {/* Footer for virtualized table */}
      <div className="table-row-footer">
        <div className="table-cell-footer" style={{ textAlign: 'right', fontWeight: 'bold', flex: 2 }}>Total:</div>
        <div className="table-cell-footer">{totals.Mega.toFixed(2)} MB</div>
        <div className="table-cell-footer">{totals.Giga.toFixed(2)} GB</div>
        <div className="table-cell-footer">{formatDuration(totals.durationInSeconds)}</div>
      </div>
    </div>
  );
};

export default memo(DataTableFooter);
