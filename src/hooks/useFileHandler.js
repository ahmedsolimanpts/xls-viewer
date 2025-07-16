import { useState, useCallback } from 'react';

const useFileHandler = (onFileReadSuccess, onFileReadError) => {
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState(null);

  const readFileAsync = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsBinaryString(file);
    });
  }, []);

  const handleFileChange = useCallback(async (file) => {
    if (!file) {
      setFileError(null);
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setFileError("Invalid file type. Please upload an .xlsx or .xls file.");
      onFileReadError("Invalid file type. Please upload an .xlsx or .xls file.");
      return;
    }

    setFileError(null);
    setIsLoadingFile(true);

    try {
      // Read only the first 4 bytes to check magic number for XLSX
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = (evt) => {
          if (evt.target.readyState === FileReader.DONE) {
            resolve(evt.target.result);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file.slice(0, 4));
      });

      const uint8Array = new Uint8Array(arrayBuffer);
      const isXlsx = uint8Array[0] === 0x50 && uint8Array[1] === 0x4B && uint8Array[2] === 0x03 && uint8Array[3] === 0x04;
      const isXls = file.name.endsWith('.xls');

      if (!isXlsx && !isXls) {
        setFileError("File is not a valid XLSX/XLS file (magic number mismatch or unsupported format).");
        onFileReadError("File is not a valid XLSX/XLS file (magic number mismatch or unsupported format).");
        setIsLoadingFile(false);
        return;
      }

      const fileData = await readFileAsync(file);
      onFileReadSuccess(fileData);
    } catch (error) {
      console.error("Error reading file:", error);
      setFileError("Error reading file. Please try again.");
      onFileReadError("Error reading file. Please try again.");
    } finally {
      setIsLoadingFile(false);
    }
  }, [onFileReadSuccess, onFileReadError, readFileAsync]);

  return { handleFileChange, isLoadingFile, fileError, setFileError };
};

export default useFileHandler;
