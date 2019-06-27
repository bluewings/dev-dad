import { useEffect, useMemo, useRef } from 'react';

function useDebounce(delay: number) {
  const timerId = useRef<any>();
  const debounce = useMemo(() => {
    return (callback: Function) => {
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
