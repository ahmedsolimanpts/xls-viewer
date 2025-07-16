import { useState, useEffect } from 'react';

const useDataSorting = (data, sortConfig) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
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
    setSortedData(sortableItems);
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    return { key, direction };
  };

  return { sortedData, requestSort };
};

export default useDataSorting;
