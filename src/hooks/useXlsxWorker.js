import { useRef, useEffect, useState } from 'react';

const useXlsxWorker = (onMessage, onError) => {
  const workerRef = useRef(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);

  useEffect(() => {
    const newWorker = new Worker('/xlsx.worker.js');
    newWorker.onmessage = (event) => {
      onMessage(event);
    };
    newWorker.onerror = (event) => {
      onError(event);
    };
    workerRef.current = newWorker;
    setIsWorkerReady(true);

    return () => {
      newWorker.terminate();
      workerRef.current = null;
      setIsWorkerReady(false);
    };
  }, [onMessage, onError]);

  const postMessageToWorker = (message) => {
    if (workerRef.current && isWorkerReady) {
      workerRef.current.postMessage(message);
    } else {
      console.warn("Web worker not ready or not initialized.");
    }
  };

  const resetWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    const newWorker = new Worker('/xlsx.worker.js');
    newWorker.onmessage = (event) => {
      onMessage(event);
    };
    newWorker.onerror = (event) => {
      onError(event);
    };
    workerRef.current = newWorker;
    setIsWorkerReady(true);
  };

  return { postMessageToWorker, isWorkerReady, resetWorker };
};

export default useXlsxWorker;
