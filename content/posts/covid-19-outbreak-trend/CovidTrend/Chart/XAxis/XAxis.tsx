import React, { useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import styles from './XAxis.module.scss';

interface IXAxisProps {
  /**
   * Prop Description
   */
  message?: string;
  barLeft: number;
  barMaxWidth: number;
  maxCount: number;
  interval: number;
  height: number;
  viewBoxHeight: number;
}

const aaa = [
  200,
  500,
  1000,
  2000,
  5000,
  10000,
  20000,
  50000,
  100000,
  200000,
  500000,
  1000000,
  2000000,
  5000000,
  10000000,
];

const getGap = (maxHeight: number) => {
  // let fas;
  const gap =
    aaa.filter((f) => {
      const count = ~~(maxHeight / f) + 1;
      return 1 < count && count < 6;
    })[0] || 200;

  return Array.from(Array(~~(maxHeight / gap) + 1)).map((e, i) => {
    return i * gap;
  });

  // \
  // return [0, 200, 400];
};

/**
 * Component Description
 */
function XAxis({
  barLeft,
  barMaxWidth,
  maxCount,
  interval,
  height,
  viewBoxHeight,
}: IXAxisProps) {
  const ticks = getGap(maxCount);

  const countRef = useRef<number>(0);

  // const textRef = useRef<any>();
  const baseline = height / 2;

  useEffect(() => {
    // const needles = [t0, t1, t2, t3, t4, t5, t6, t7, t8];

    const from = new Date().valueOf();
    const to = from + interval;
    const scaled = scaleLinear()
      .domain([from, to])
      .range([countRef.current, maxCount])
      .clamp(true);

    let raf: number;
    let timer: any;
    const updateCount = () => {
      clearTimeout(timer);
      // if ()
      const now = new Date().valueOf();
      countRef.current = ~~scaled(now);
      const ticks = getGap(countRef.current);
      if (tck.current) {
        // tck.current.innerHTML = `<text x="40" y="150" stroke="green">test</text>`;

        // ).toLocaleString();
        tck.current.innerHTML = ticks
          .map((e) => {
            return [e, (barMaxWidth * e) / countRef.current];
          })
          .map(([e, f], i) => {
            // if (e) {
            return `
            <g transform="translate(${f}, 0)">
            <text
            
            y="${baseline}"
            >
            ${Number(e).toLocaleString()}</text>

            <line x1="0" y1="30" x2="0" y2="${viewBoxHeight}" 
            
            />
            </g>
  
            `;

            // e.current.transform = `translate(${
            //   (barMaxWidth * ticks[i]) / maxCount
            // }, 0)`;
            // e.current.textContent = ticks[i];
            // }
            // return '';
          })
          .join('');

        // countRef.current;
      }
      if (now < to) {
        // timer = setTimeout(() => {
        requestAnimationFrame(updateCount);
        // }, 200);
      }
    };
    updateCount();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [maxCount, barMaxWidth, baseline, interval]);

  const tck = useRef<any>();

  return (
    <g>
      <g className={styles.tick} transform={`translate(${barLeft}, 0)`}>
        <g ref={tck} />
      </g>
    </g>
  );
}

export default XAxis;
