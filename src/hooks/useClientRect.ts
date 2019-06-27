/* eslint-disable no-underscore-dangle */
import { useState, useRef, useEffect } from 'react';

function useClientRect(properties: any, clientRef?: any) {
  const builtInRef = useRef();
  const requestId = useRef<any>();

  const _properties = Array.isArray(properties) ? properties : ['left', 'top', 'right', 'bottom', 'width', 'height'];
  const _clientRef = clientRef || builtInRef;

  const [size, setSize] = useState({ arr: null, rect: null });

  useEffect(() => {
    const watch = () => {
      if (_clientRef && _clientRef.current && _clientRef.current.parentNode) {
        const rect = _clientRef.current.parentNode.getBoundingClientRect();
        const { obj, arr } = _properties.reduce(
          (prev, key) => {
            const value = rect[key];
            if (typeof value === 'undefined') {
              return prev;
            }
            return {
              obj: { ...prev.obj, [key]: value },
              arr: [...prev.arr, value],
            };
          },
          { obj: {}, arr: [] },
        );

        if (size.arr !== arr.join('_')) {
          setSize({ rect: obj, arr: arr.join('_') });
        } else {
          requestId.current = window.requestAnimationFrame(watch);
        }
      }
    };
    watch();
    return () => {
      if (requestId.current) {
        window.cancelAnimationFrame(requestId.current);
      }
    };
  });
  return [size.rect || {}, _clientRef];
}

export default useClientRect;
