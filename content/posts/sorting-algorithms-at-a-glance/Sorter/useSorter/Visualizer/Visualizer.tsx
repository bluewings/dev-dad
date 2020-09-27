import React, { forwardRef, useEffect, useMemo, useImperativeHandle, useReducer } from 'react';
import { useMeasure } from 'react-use';
import Bar from './Bar';
import styles from './Visualizer.module.scss';
import { reducer } from './Visualizer.reducer';

interface IVisualizerProps {
  values: number[];
  height: number;
}

function Visualizer({ values, height }: IVisualizerProps, ref: any) {
  const [rootRef, { width: viewBoxWidth }]: [any, any] = useMeasure();

  const [barWidth, marginLeft, unitHeight] = useMemo(() => {
    const barWidth = Math.min(~~(viewBoxWidth / values.length), 50);
    return [barWidth, barWidth * values.length, ~~(height / Math.max(...values))];
  }, [viewBoxWidth, height, values]);

  const [state, dispatch] = useReducer(reducer, {
    blocks: [{}],
    items: values.map((value, key) => ({ value, key, i: key })),
  });

  useEffect(() => {
    dispatch({ type: 'INIT', payload: values.map((value, key) => ({ value, key, i: key })) });
  }, [values]);

  const itemMap = useMemo(() => {
    const accum: any = {};
    const compareMap = state.compare || {};
    const done = state.done || {};
    const swap = state.swap || {};

    const block = state.blocks[0];

    const { type, target: payload } = block?.action || {};

    const target = Array.isArray(payload) ? payload : [payload];

    // console.log(target, type);

    const done2 = state?.done || [];

    [block.temp, ...state.items].filter(Boolean).forEach((e: any) => {
      const { value, key, i } = e;
      const height = 20 * value;
      accum[key] = {
        value,
        key,
        pos: i,
        left: i * 20 + 1,
        height,
        y: 210 - height + (state._temp === e ? height + 2 : 0),

        tags: [
          target.includes(i) && type,
          done2.includes(i) && 'done',
          // block.indexMin === i && 'index-min',
          block.indexMin === i && 'indexMin',
          block.temp && block.temp === e && 'temp',
        ].filter(Boolean),
        className: [
          styles.item,
          target[i] && styles[type],
          compareMap[i] && styles.compare,
          done[i] && styles.done,
          swap[i] && styles.swap,
          state.indexMin === i && styles.indexMin,
          state.access === i && styles.compare,
          state.temp === i && styles.temp,
          state.restore === i && styles.restore,
        ]
          .filter(Boolean)
          .join(' '),
      };
    });
    return accum;
  }, [state]);

  useImperativeHandle(
    ref,
    () => ({
      action: ({ type, payload }: any) => {
        dispatch({ type, payload });
      },
    }),
    [dispatch],
  );

  return (
    <div className={styles.root} ref={rootRef}>
      {viewBoxWidth && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: marginLeft, height }}>
            {values.map((value, i) => (
              <Bar key={i} {...itemMap[i]} width={barWidth} height={unitHeight * value} containerHeight={height} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default forwardRef(Visualizer);
