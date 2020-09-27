import React, { useCallback, useMemo, useState, useLayoutEffect, useEffect, useRef, ReactElement } from 'react';
import { css } from '@emotion/core';
import bubble from './algorithm/bubble';
import selection from './algorithm/selection';
import insertion from './algorithm/insertion';
import merge from './algorithm/merge';
import Visualizer from './Visualizer';

export enum Algorithm {
  BUBBLE = 'bubble',
  SELECTION = 'selection',
  INSERTION = 'insertion',
  MERGE = 'merge',
}

const type: any = {
  [Algorithm.BUBBLE]: bubble,
  [Algorithm.SELECTION]: selection,
  [Algorithm.INSERTION]: insertion,
  [Algorithm.MERGE]: merge,
};

function useSorter(algorithm: string, arr: number[], options: any = {}) {
  const serialized = arr.join(',');
  const values = useMemo(() => serialized.split(',').map((e) => Number(e)), [serialized]);

  const delay = useRef<number>();
  delay.current = typeof options.delay === 'number' ? options.delay : 500;
  const pause = useRef<boolean>(false);
  pause.current = typeof options.pause === 'boolean' ? options.pause : false;

  const wait = useCallback(
    (_delay?: number) =>
      new Promise((resolve) => {
        setTimeout(
          () => {
            function _pause() {
              if (pause.current) {
                setTimeout(_pause, 200);
              } else {
                resolve();
              }
            }
            _pause();
          },
          typeof _delay === 'number' ? _delay : delay.current,
        );
      }),
    [],
  );

  const viewerRef = useRef<any>(null);

  const Viewer = useMemo(() => {
    const values = serialized.split(',').map((e) => ~~e);
    return ({ height = 300 }: any) => <Visualizer values={values} ref={viewerRef} height={height} />;
  }, [serialized]);

  const processViz = useMemo(
    () => async ({ type, payload }: any) => {
      if (typeof viewerRef.current?.action === 'function' && type) {
        viewerRef.current?.action({ type, payload });
      }
    },
    [wait],
  );

  const [done, setDone] = useState(false);

  const sorter = useMemo(() => {
    const sorter = type[algorithm] || type[Algorithm.BUBBLE];
    return () => {
      let cancel = false;
      (async () => {
        setDone(false);
        const operations = sorter(values.slice());
        let result;
        for (const operation of operations) {
          result = operation;
          if (cancel) {
            break;
          }
          if (operation && operation.type) {
            processViz(operation);
            if (!operation.type.startsWith('@')) {
              await wait();
            }
          }
        }
        setDone(true);
        return result;
      })();
      return () => {
        cancel = true;
      };
    };
  }, [algorithm, values, processViz, wait]);

  return [Viewer, sorter, { done }] as any[];
}

export default useSorter;
