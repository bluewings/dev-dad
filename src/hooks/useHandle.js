import { useRef } from 'react';

function useHandle(callback) {
  const handle = useRef();
  handle.current = callback;
  return (...args) => {
    if (typeof handle.current === 'function') {
      handle.current(...args);
    }
  };
}

export default useHandle;
