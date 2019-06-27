import { useRef } from 'react';

function useHandle(callback: any) {
  const handle = useRef<any>();
  handle.current = callback;
  return (...args: any[]) => {
    if (typeof handle.current === 'function') {
      handle.current(...args);
    }
  };
}

export default useHandle;
