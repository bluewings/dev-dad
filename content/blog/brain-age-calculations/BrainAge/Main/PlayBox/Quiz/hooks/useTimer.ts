import { useCallback, useMemo } from 'react';

function useTimer() {
  const startTime = useMemo(() => new Date().valueOf(), []);
  return useCallback(() => new Date().valueOf() - startTime, [startTime]);
}

export default useTimer;
