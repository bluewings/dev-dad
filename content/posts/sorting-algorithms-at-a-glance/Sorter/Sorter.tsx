import React, { useMemo, useEffect, useRef } from 'react';
import { css } from '@emotion/core';
import useSorter from './useSorter';
import styles from './Sorter.module.scss';

export enum Algorithm {
  BUBBLE = 'bubble',
  SELECTION = 'selection',
  INSERTION = 'insertion',
  MERGE = 'merge',
}

enum State {
  SORT = 'sort',
  PAUSE = 'pause',
  DONE = 'done',
}

interface ISorterProps {
  algorithm: string;
  values: number[];
  height?: number;
  pause?: boolean;
  speed?: number;
  onStateChange?: Function;
}

/**
 * Component Description
 */
function Sorter({ algorithm, values, height, pause, speed, onStateChange }: ISorterProps) {
  const delay = 1000 / speed;
  const [Viewer, sorter, { done }] = useSorter(algorithm, values, { delay, pause });

  useEffect(() => {
    const aaa = sorter();
    return () => {
      aaa();
    };
  }, [sorter]);

  const customStyles = useMemo(() => {
    const { styles: customStyles } = css`
      .${styles.root} {
        --bar-transition-duration: ${delay}ms;
      }
      .${styles.item} {
        transition: ${delay}ms left ease-in-out, ${delay}ms bottom ease-out, ${delay}ms background ease-out;
      }
      .${styles.restore} {
        transition: ${delay / 2}ms left ease-in-out, ${delay / 2}ms ${delay / 2}ms bottom ease-out;
      }
    `;
    return customStyles;
  }, [delay]);

  const state = useMemo(() => (pause ? State.PAUSE : done ? State.DONE : State.SORT), [done, pause]);

  const handleStateChange = useRef<Function>();
  handleStateChange.current = onStateChange;

  useEffect(() => {
    if (typeof handleStateChange.current === 'function') {
      handleStateChange.current(state);
    }
  }, [state]);

  return (
    <div className={styles.root}>
      <Viewer height={height} />
      <style type="text/css">{customStyles}</style>
    </div>
  );
}

export default Sorter;

export enum ESortOps {
  NONE,
  ACCESS,
  COMPARE,
  SWAP,
  SORT,
  DONE,
}

export enum ESortOpStages {
  NONE,
  PRE,
  IN,
  POST,
}
