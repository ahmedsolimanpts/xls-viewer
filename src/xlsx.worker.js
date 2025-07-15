
import * as XLSX from 'xlsx';

onmessage = (event) => {
  const { fileData } = event.data;
  try {
    const wb = XLSX.read(fileData, { type: 'binary' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });
    postMessage({ status: 'success', jsonData });
  } catch (error) {
    postMessage({ status: 'error', message: error.message });
  }
};
