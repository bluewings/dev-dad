import { useEffect, useMemo, useRef } from 'react';

function useDebounce(delay) {
  const timerId = useRef();
  const debounce = useMemo(() => {
    return (callback) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        callback();
      }, delay);
    };
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  return debounce;
}

export default useDebounce;
