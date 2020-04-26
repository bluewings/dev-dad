import React, { useMemo, useRef, useEffect } from 'react';
import { scaleLinear } from 'd3-scale';
import { format } from 'date-fns';
import styles from './Summary.module.scss';

interface ISummaryProps {
  /**
   * Prop Description
   */
  date: string;

  totalCount: number;
  interval: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

const fontSize = 48;

/**
 * Component Description
 */
function Summary({
  date,
  totalCount: count,
  interval,
  viewBoxWidth,
  viewBoxHeight,
}: ISummaryProps) {
  const textRef = useRef<any>();
  const countRef = useRef<number>(0);
  const totalRef = useRef<any>();

  useEffect(() => {
    const from = new Date().valueOf();
    const to = from + interval;
    const scaled = scaleLinear()
      .domain([from, to])
      .range([countRef.current, count])
      .clamp(true);

    let raf: number;
    const updateCount = () => {
      const now = new Date().valueOf();
      countRef.current = ~~scaled(now);
      if (textRef.current) {
        // textRef.current.textContent = Number(
        //   ~~countRef.current,
        // ).toLocaleString();

        let dist = 0;
        const countStr = Number(~~countRef.current)
          // const countStr = Number(3214567)
          .toLocaleString()
          .split('')
          .reverse()
          .map((e: string) => {
            // const _dist = dist;
            dist += fontSize * (e === ',' ? 0.25 : 0.67);
            return `<text x=${
              viewBoxWidth -
              dist -
              (e === ',' ? fontSize * 0.25 : 0) +
              fontSize / 2
            } font-size=${fontSize}>${e}</text>`;
          })
          .reverse()
          .join('');

        totalRef.current.innerHTML = countStr;
      }
      if (now < to) {
        requestAnimationFrame(updateCount);
      }
    };
    updateCount();

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [count, interval, viewBoxWidth, viewBoxHeight]);

  const dateStr = useMemo(() => {
    return format(new Date(date), 'd, MMM');
  }, [date]);

  return (
    <g className={styles.root}>
      <g
        ref={totalRef}
        className={styles.totalCount}
        transform={`translate(-8, ${viewBoxHeight - 8})`}
      />
      <text
        ref={textRef}
        // className={styles.count}
        // transform={`translate(${barWidth}, 0)`}
        // x={PADDING}
        // y={baseline - barTop}
        x={viewBoxWidth - 3}
        y={viewBoxHeight - fontSize - 8}
        fontSize={32}
        // textAnchor=""
        textAnchor="end"
        // alignmentBaseline="bottom"
        // fill={COLOR}
      >
        {/* 467,653 */}
        {dateStr}
      </text>
    </g>
  );
}

export default Summary;
